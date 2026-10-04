from pathlib import Path
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, PageBreak

OUT=Path('output/pdf/fh-dortmund-buddy-hunt-word-puzzles.pdf'); OUT.parent.mkdir(parents=True,exist_ok=True)
G,M,I=HexColor('#244c3e'),HexColor('#769c63'),HexColor('#223b33')
P,E,S,L=HexColor('#fcfcf8'),HexColor('#ebf3e6'),HexColor('#f5f1e9'),HexColor('#d7e3d2')
doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=16*mm,leftMargin=16*mm,topMargin=16*mm,bottomMargin=14*mm,title='FH Dortmund Campus Cipher Mission')
ss=getSampleStyleSheet()
ss.byAlias.pop('title',None)
for n,kw in {'title':dict(fontName='Helvetica-Bold',fontSize=25,leading=29,textColor=G,spaceAfter=5),'over':dict(fontName='Helvetica-Bold',fontSize=8.5,leading=11,textColor=M,spaceAfter=6),'deck':dict(fontName='Helvetica',fontSize=10.2,leading=14,textColor=HexColor('#64766c'),spaceAfter=10),'head':dict(fontName='Helvetica-Bold',fontSize=11.5,leading=14,textColor=I),'body':dict(fontName='Helvetica',fontSize=9.2,leading=12.5,textColor=I),'small':dict(fontName='Helvetica',fontSize=7.9,leading=10,textColor=HexColor('#65756b')),'code':dict(fontName='Courier-Bold',fontSize=13,leading=16,textColor=G),'ans':dict(fontName='Helvetica-Bold',fontSize=9.2,leading=12,textColor=G)}.items(): ss.add(ParagraphStyle(n,parent=ss['Normal'],**kw))

# Collected letters form CAMPUS.
missions=[
('01','Computer Science - Building 42','CAESAR','HTRUZYJW XHNJSHJ - 42','Shift every letter back 5 places.','Which faculty is based here?','Computer Science','C','Record the first letter of the solved destination.'),
('02','Architecture - Building 40','ATBASH','ZIXSRGVXGFIV - 40','Use the mirror alphabet: A=Z, B=Y, C=X.','Which subject is connected to this building?','Architecture','A','Record the first letter of the solved destination.'),
('03','Mensa kostBar - Building 40a','MORSE','-- . -. ... .- / -.- --- ... - -... .- .-. - 40A','Use the Morse key below. / separates words.','What is the name of this FH campus dining spot?','Mensa kostBar','M','Record the first letter of the solved destination.'),
('04','Psychological counseling - Building 38','NUMBER LOCK','16-19-25-3-8-15-12-15-7-9-3-1-12','A=1, B=2 ... Z=26. The building clue is 38.','Which support service is shown on the map at Building 38?','Psychological counseling','P','Record the first letter of the solved destination.'),
('05','Campus Library - Building 44','VOWEL SHIFT','CEMPIS LEBRERY - 44','Every vowel moved forward once: A>E, E>I, I>O, O>U, U>A. Move it back.','What service can help you find course literature?','Campus Library','U','Record the fifth letter of the solved first word.'),
('06','AStA - Building 38b','ANAGRAM','TAAS - 38B','Rearrange the letters. Keep the building number.','Which building number is the AStA office in?','38b','S','Record the first letter of the team service name.')]

def header(c,d):
 c.saveState();c.setFillColor(P);c.rect(0,A4[1]-12*mm,A4[0],12*mm,fill=1,stroke=0);c.setFillColor(G);c.setFont('Helvetica-Bold',7.5);c.drawString(16*mm,A4[1]-8*mm,'CAMPUS COMPASS / FH DORTMUND');c.setFont('Helvetica',7.5);c.drawRightString(A4[0]-16*mm,A4[1]-8*mm,f'CIPHER MISSION / PAGE {d.page}');c.restoreState()
def table(data,widths,style):
 x=Table(data,colWidths=widths);x.setStyle(TableStyle(style));return x
def card(n,title,cipher,code,key,q,a,letter,extract):
 top=table([[Paragraph(f'<b>{n}</b>',ss['body']),Paragraph(title,ss['head']),Paragraph('3 MIN',ss['ans'])]],[10*mm,126*mm,21*mm],[('BACKGROUND',(0,0),(0,0),G),('TEXTCOLOR',(0,0),(0,0),white),('ALIGN',(0,0),(0,0),'CENTER'),('BACKGROUND',(1,0),(2,0),E),('ALIGN',(2,0),(2,0),'RIGHT'),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)])
 box=table([[Paragraph(f'<b>{cipher} CODE</b>',ss['small']),Paragraph(code,ss['code'])]],[33*mm,124*mm],[('BACKGROUND',(0,0),(-1,-1),S),('BOX',(0,0),(-1,-1),.45,L),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)])
 return KeepTogether([top,box,Spacer(1,4),Paragraph(f'<b>Key:</b> {key}',ss['small']),Paragraph(f'<b>Field question:</b> {q}',ss['body']),Paragraph('Team answer: '+'_'*88,ss['body']),Paragraph(f'<b>Meta-letter:</b> {extract} Letter: '+'_'*10,ss['small']),Spacer(1,7)])

story=[Paragraph('FH DORTMUND / BUDDY HUNT',ss['over']),Paragraph('Campus Cipher Mission',ss['title']),Paragraph('A harder 20-25 minute scavenger hunt for 20 students with one buddy. Split into five teams of four. Solve a cipher, navigate to the real place, answer the field question, and collect the final code.',ss['deck'])]
brief=table([[Paragraph('<b>MISSION RULES</b><br/>Each team starts at a different card. Solve the cipher before using the map. You may use the map only after your first attempt. The buddy gives a hint after 90 seconds.',ss['body']),Paragraph('<b>TIMEKEEPER PLAN</b><br/>3 minutes at each of six ciphers = 18 minutes. Add 3 minutes to start and 3 minutes to compare the final code. Keep to public areas and do not interrupt classes or staff.',ss['body'])]],[78*mm,79*mm],[('BACKGROUND',(0,0),(-1,-1),E),('BOX',(0,0),(-1,-1),.6,L),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9)])
toolkit=table([[Paragraph('<b>CAESAR</b><br/>Shift back 5',ss['small']),Paragraph('<b>ATBASH</b><br/>A=Z, B=Y, C=X',ss['small']),Paragraph('<b>MORSE</b><br/>A .-  B -...  E .  K -.-  M --  N -.  O ---  R .-.  S ...  T -',ss['small']),Paragraph('<b>NUMBER LOCK</b><br/>A=1 ... Z=26',ss['small'])]],[34*mm,39*mm,57*mm,27*mm],[('BACKGROUND',(0,0),(-1,-1),S),('BOX',(0,0),(-1,-1),.5,L),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)])
story += [brief,Spacer(1,10),Paragraph('TEAM: '+'_'*33+'  /  BUDDY: '+'_'*26,ss['body']),Spacer(1,8),Paragraph('CIPHER TOOLKIT',ss['over']),toolkit,Spacer(1,10)]
for x in missions[:3]:story.append(card(*x))
story += [PageBreak(),Paragraph('Continue the mission',ss['title']),Paragraph('Decode the final three checkpoints. Do not reveal the meta-code until every team has a letter.',ss['deck'])]
for x in missions[3:]:story.append(card(*x))
meta=table([[Paragraph('<b>FINAL META-CODE</b><br/>Put the six collected letters in order: '+'  '.join('_' for _ in range(6))+'<br/><br/>What does the code say about where you are? '+'_'*48,ss['body'])]],[157*mm],[('BACKGROUND',(0,0),(-1,-1),E),('BOX',(0,0),(-1,-1),.7,M),('LEFTPADDING',(0,0),(-1,-1),11),('RIGHTPADDING',(0,0),(-1,-1),11),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10)])
story += [Spacer(1,4),meta,PageBreak(),Paragraph('BUDDY ANSWER KEY',ss['title']),Paragraph('Keep this page with the buddy. Give a hint before revealing a solution.',ss['deck'])]
rows=[[Paragraph('<b>STOP</b>',ss['small']),Paragraph('<b>DESTINATION</b>',ss['small']),Paragraph('<b>FIELD ANSWER</b>',ss['small']),Paragraph('<b>LETTER</b>',ss['small'])]]
for n,title,cipher,code,key,q,a,letter,extract in missions:rows.append([Paragraph(n,ss['ans']),Paragraph(title,ss['body']),Paragraph(a,ss['ans']),Paragraph(letter,ss['ans'])])
answers=table(rows,[14*mm,69*mm,59*mm,15*mm],[('BACKGROUND',(0,0),(-1,0),G),('TEXTCOLOR',(0,0),(-1,0),white),('GRID',(0,0),(-1,-1),.45,L),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)])
story += [answers,Spacer(1,9),Paragraph('<b>Meta-code solution:</b> CAMPUS. Finish by asking each team to share one useful place they found and one campus question they still have.',ss['body'])]
doc.build(story,onFirstPage=header,onLaterPages=header);print(OUT)
