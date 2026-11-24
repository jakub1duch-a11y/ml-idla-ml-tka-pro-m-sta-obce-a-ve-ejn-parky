#!/usr/bin/env /usr/bin/python3
"""Generate a review-only blurred copy, never overwrite the original."""
import argparse,cv2,subprocess,tempfile,os
p=argparse.ArgumentParser();p.add_argument('source');p.add_argument('output');a=p.parse_args()
face=cv2.CascadeClassifier('/usr/share/opencv4/haarcascades/haarcascade_frontalface_default.xml')
cap=cv2.VideoCapture(a.source)
if not cap.isOpened():raise SystemExit('Cannot read input')
fps=cap.get(cv2.CAP_PROP_FPS) or 25;w=int(cap.get(3));h=int(cap.get(4))
with tempfile.TemporaryDirectory() as td:
 raw=os.path.join(td,'raw.mp4');writer=cv2.VideoWriter(raw,cv2.VideoWriter_fourcc(*'mp4v'),fps,(w,h));n=hits=0
 while True:
  ok,frame=cap.read()
  if not ok:break
  gray=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
  for x,y,bw,bh in face.detectMultiScale(gray,scaleFactor=1.1,minNeighbors=4,minSize=(22,22)):
   pad=int(max(bw,bh)*.22);x0=max(0,x-pad);y0=max(0,y-pad);x1=min(w,x+bw+pad);y1=min(h,y+bh+pad)
   roi=frame[y0:y1,x0:x1];kw=max(3,(min(roi.shape[:2])//2)*2+1)
   frame[y0:y1,x0:x1]=cv2.GaussianBlur(roi,(kw,kw),0);hits+=1
  writer.write(frame);n+=1
 writer.release();cap.release()
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',raw,'-i',a.source,'-map','0:v:0','-map','1:a?','-c:v','libx264','-preset','veryfast','-crf','23','-c:a','copy','-movflags','+faststart',a.output],check=True)
 print(f'frames={n} face_detections={hits} output={a.output}')
