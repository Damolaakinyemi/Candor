import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  ComposedChart, Scatter, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, ScatterChart, ReferenceLine, Cell,
} from "recharts";
import {
  Upload, TrendingUp, Database, ArrowRight, Sigma, BarChart3, Table as TableIcon,
  LayoutGrid, AlertTriangle, Save, Trash2, FolderOpen, Download, FileText,
  FileSpreadsheet, Plus, Pencil, Home, GraduationCap, Lightbulb, HelpCircle,
  Check, X, ShieldAlert, Search, LayoutTemplate, BookOpen, CircleDot, Activity,
  ChevronUp, ChevronDown, Globe, Loader2, Link2,
} from "lucide-react";
import Papa from "papaparse";
import * as math from "mathjs";

const T = {
  ink:"#14181D", inkSoft:"#2A313B", paper:"#EDF0F2", surface:"#FFFFFF",
  interval:"#2C6E8F", intervalDeep:"#1E4F68", point:"#C0832A", pointSoft:"#E8B563",
  muted:"#5C6671", line:"#D7DCE1", danger:"#A8403A", ribbon:"#F4F6F7",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.candor *{box-sizing:border-box;}
.candor{font-family:'IBM Plex Sans',system-ui,sans-serif;color:${T.ink};background:${T.paper};-webkit-font-smoothing:antialiased;line-height:1.5;}
.fdisplay{font-family:'Fraunces',Georgia,serif;font-optical-sizing:auto;letter-spacing:-0.015em;}
.fmono{font-family:'IBM Plex Mono',ui-monospace,monospace;}
.eyebrow{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${T.interval};font-weight:500;}
.btn{font-family:'IBM Plex Sans';font-weight:500;border:none;cursor:pointer;border-radius:2px;transition:transform .12s ease,background .15s ease,border-color .15s ease;display:inline-flex;align-items:center;gap:8px;text-decoration:none;}
.btn:active{transform:translateY(1px);}
.btn:disabled{opacity:.4;cursor:not-allowed;}
.btn-primary{background:${T.ink};color:${T.paper};padding:13px 22px;font-size:15px;}
.btn-primary:hover{background:${T.intervalDeep};}
.btn-ghost{background:transparent;color:${T.ink};padding:12px 18px;font-size:15px;border:1px solid ${T.line};}
.btn-ghost:hover{border-color:${T.ink};}
.btn-sm{padding:8px 14px;font-size:13px;}
.card{background:${T.surface};border:1px solid ${T.line};border-radius:4px;}
.candor a{color:inherit;}
.candor :focus-visible{outline:2px solid ${T.point};outline-offset:2px;}
.lift{transition:transform .2s ease,box-shadow .2s ease;}
.lift:hover{transform:translateY(-3px);box-shadow:0 12px 30px -18px rgba(20,24,29,.4);}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
.fade{animation:fadeUp .45s cubic-bezier(.2,.7,.2,1) both;}
.scrollbox{scrollbar-width:thin;scrollbar-color:${T.line} transparent;}
.tbar{font-family:'IBM Plex Sans';font-size:13px;border:none;background:transparent;color:${T.ink};padding:7px 12px;cursor:pointer;border-radius:3px;display:inline-flex;align-items:center;gap:7px;}
.tbar:hover:not(:disabled){background:${T.paper};}
.tbar:disabled{opacity:.4;cursor:not-allowed;}
.iconbtn{background:transparent;border:none;cursor:pointer;color:${T.muted};padding:3px;border-radius:3px;display:inline-flex;}
.iconbtn:hover{color:${T.ink};background:${T.paper};}
.tplcard{cursor:pointer;text-align:left;background:${T.surface};border:1px solid ${T.line};border-radius:6px;padding:0;overflow:hidden;transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease;}
.tplcard:hover{transform:translateY(-3px);box-shadow:0 14px 32px -18px rgba(20,24,29,.45);border-color:${T.interval};}
.vizrow{display:flex;gap:12px;align-items:flex-start;width:100%;text-align:left;background:transparent;border:1px solid transparent;border-radius:5px;padding:11px 12px;cursor:pointer;}
.vizrow:hover{background:${T.paper};border-color:${T.line};}
.overlay{position:fixed;inset:0;background:rgba(20,24,29,.42);z-index:60;display:flex;align-items:flex-start;justify-content:center;padding:60px 16px;}
.tpanel{position:fixed;top:0;right:0;height:100vh;width:360px;max-width:92vw;background:${T.surface};border-left:1px solid ${T.line};box-shadow:-18px 0 40px -28px rgba(20,24,29,.5);z-index:55;display:flex;flex-direction:column;animation:slideIn .25s ease both;}
@keyframes slideIn{from{transform:translateX(30px);opacity:.4;}to{transform:none;opacity:1;}}
.chip{font-family:'IBM Plex Mono';font-size:11px;border:1px solid ${T.line};background:${T.surface};color:${T.muted};border-radius:14px;padding:4px 11px;cursor:pointer;}
.chip:hover,.chip.on{border-color:${T.interval};color:${T.interval};}
.suggrow:hover{border-color:${T.interval}!important;background:rgba(44,110,143,.05)!important;}
.rtab{font-family:'IBM Plex Sans';font-size:12.5px;font-weight:500;border:none;background:transparent;color:${T.muted};padding:8px 15px;cursor:pointer;border-bottom:2px solid transparent;white-space:nowrap;}
.rtab:hover{color:${T.ink};}
.rtab.on{color:${T.interval};border-bottom-color:${T.interval};background:${T.ribbon};}
.rgroup{display:flex;flex-direction:column;justify-content:space-between;padding:6px 11px;border-right:1px solid ${T.line};min-height:84px;}
.rgroup-btns{display:flex;gap:2px;flex:1;align-items:stretch;}
.rgroup-label{text-align:center;font-family:'IBM Plex Mono';font-size:9.5px;letter-spacing:0.05em;color:${T.muted};padding-top:5px;text-transform:uppercase;}
.rbtn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-width:58px;padding:6px 9px;background:transparent;border:1px solid transparent;border-radius:3px;cursor:pointer;font-family:'IBM Plex Sans';font-size:11px;font-weight:500;color:${T.ink};transition:background .12s ease;}
.rbtn:hover:not(:disabled){background:rgba(44,110,143,.09);border-color:${T.line};}
.rbtn:disabled{opacity:.32;cursor:not-allowed;}
.rbtn span{line-height:1.08;text-align:center;max-width:80px;}
@keyframes spin{to{transform:rotate(360deg);}}
@media (prefers-reduced-motion:reduce){.fade,.tpanel{animation:none;}}
`;

function logGamma(x){const g=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,0.1208650973866179e-2,-0.5395239384953e-5];let xx=x,y=x,tmp=x+5.5;tmp-=(xx+0.5)*Math.log(tmp);let ser=1.000000000190015;for(let j=0;j<6;j++){y+=1;ser+=g[j]/y;}return -tmp+Math.log(2.5066282746310005*ser/xx);}
function betacf(a,b,x){const MAXIT=200,EPS=3e-12,FPMIN=1e-30;let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;if(Math.abs(d)<FPMIN)d=FPMIN;d=1/d;let h=d;for(let m=1;m<=MAXIT;m++){let m2=2*m,aa=m*(b-m)*x/((qam+m2)*(a+m2));d=1+aa*d;if(Math.abs(d)<FPMIN)d=FPMIN;c=1+aa/c;if(Math.abs(c)<FPMIN)c=FPMIN;d=1/d;h*=d*c;aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa*d;if(Math.abs(d)<FPMIN)d=FPMIN;c=1+aa/c;if(Math.abs(c)<FPMIN)c=FPMIN;d=1/d;let del=d*c;h*=del;if(Math.abs(del-1)<EPS)break;}return h;}
function incompleteBeta(x,a,b){if(x<=0)return 0;if(x>=1)return 1;const lbeta=logGamma(a+b)-logGamma(a)-logGamma(b)+a*Math.log(x)+b*Math.log(1-x);const front=Math.exp(lbeta);if(x<(a+1)/(a+b+2))return front*betacf(a,b,x)/a;return 1-front*betacf(b,a,1-x)/b;}
function twoSidedP(t,df){if(!isFinite(t))return 0;return incompleteBeta(df/(df+t*t),df/2,0.5);}
function tcdf(t,df){const ib=incompleteBeta(df/(df+t*t),df/2,0.5);return t>0?1-0.5*ib:0.5*ib;}
function tInv(p,df){let lo=-60,hi=60;for(let i=0;i<160;i++){const m=(lo+hi)/2;if(tcdf(m,df)<p)lo=m;else hi=m;}return (lo+hi)/2;}
function invSym(M){try{return math.inv(M);}catch(e){if(typeof math.pinv==="function")return math.pinv(M);throw e;}}
function fSurv(F,d1,d2){if(!isFinite(F)||F<=0)return 1;return incompleteBeta(d2/(d2+d1*F),d2/2,d1/2);}
function ols(Xrows,y){
  const n=y.length,X=Xrows.map(r=>[1,...r]),k=X[0].length;
  const Xt=math.transpose(X),XtXinv=invSym(math.multiply(Xt,X));
  const beta=math.multiply(XtXinv,math.multiply(Xt,y));
  const yhat=X.map(row=>row.reduce((s,v,i)=>s+v*beta[i],0));
  const resid=y.map((v,i)=>v-yhat[i]);
  const sse=resid.reduce((s,e)=>s+e*e,0),ybar=y.reduce((a,b)=>a+b,0)/n,sst=y.reduce((s,v)=>s+(v-ybar)**2,0);
  const df=n-k,sigma2=sse/df;
  const se=XtXinv.map((row,i)=>Math.sqrt(sigma2*row[i]));
  const tstat=beta.map((b,i)=>b/se[i]),pval=tstat.map(t=>twoSidedP(Math.abs(t),df));
  const Xe=X.map((row,i)=>row.map(v=>v*resid[i]));
  const meat=math.multiply(math.transpose(Xe),Xe);
  const Vr=math.multiply(math.multiply(XtXinv,meat),XtXinv),cfac=n/(n-k);
  const seR=Vr.map((row,i)=>Math.sqrt(Math.max(0,cfac*row[i])));
  const tR=beta.map((b,i)=>b/seR[i]),pR=tR.map(t=>twoSidedP(Math.abs(t),df));
  const r2=1-sse/sst;
  return {beta,se,tstat,pval,seR,tR,pR,r2,adj:1-(1-r2)*(n-1)/df,n,k,df,yhat,resid,sigma:Math.sqrt(sigma2),X,XtXinv,sse,sst};
}
// --- Robust / cluster variance-covariance engine (validated vs statsmodels) ---
function leverages(X,XtXinv){return X.map(xi=>{const a=math.multiply(XtXinv,xi);return xi.reduce((s,v,j)=>s+v*a[j],0);});}
function vcov(X,resid,XtXinv,opts){
  const n=X.length,k=X[0].length,type=(opts&&opts.type)||"classical";
  const zeros=()=>Array.from({length:k},()=>new Array(k).fill(0));
  if(type==="classical"){const s2=resid.reduce((a,e)=>a+e*e,0)/(n-k);return {V:math.multiply(XtXinv,s2),dfp:n-k};}
  if(type==="cluster"){
    const groups=new Map();
    (opts.clusterIds||[]).forEach((g,i)=>{const key=String(g);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(i);});
    const meat=zeros();
    for(const idxs of groups.values()){const sg=new Array(k).fill(0);idxs.forEach(i=>{for(let j=0;j<k;j++)sg[j]+=X[i][j]*resid[i];});for(let a=0;a<k;a++)for(let b=0;b<k;b++)meat[a][b]+=sg[a]*sg[b];}
    const G=groups.size,c=(G/(G-1))*((n-1)/(n-k));
    return {V:math.multiply(math.multiply(math.multiply(XtXinv,meat),XtXinv),c),dfp:G-1,G};
  }
  let h=null;if(type==="HC2"||type==="HC3")h=leverages(X,XtXinv);
  const meat=zeros();
  for(let i=0;i<n;i++){let w=resid[i]*resid[i];if(type==="HC2")w=resid[i]*resid[i]/(1-h[i]);else if(type==="HC3")w=resid[i]*resid[i]/((1-h[i])*(1-h[i]));for(let a=0;a<k;a++)for(let b=0;b<k;b++)meat[a][b]+=w*X[i][a]*X[i][b];}
  let V=math.multiply(math.multiply(XtXinv,meat),XtXinv);
  if(type==="HC1")V=math.multiply(V,n/(n-k));
  return {V,dfp:n-k};
}
function seFromV(V){return V.map((row,i)=>Math.sqrt(Math.max(0,row[i])));}
// Regression with a chosen SE type ("classical"|"HC1"|"HC2"|"HC3"|"cluster")
function regress(Xrows,y,opts){
  opts=opts||{};const f=ols(Xrows,y);const {V,dfp,G}=vcov(f.X,f.resid,f.XtXinv,opts);
  const se=seFromV(V),t=f.beta.map((b,i)=>b/se[i]),p=t.map(tt=>twoSidedP(Math.abs(tt),dfp));
  return {...f,se,t,p,dfp,G,seType:opts.type||"classical"};
}
function lmFit(Xrows,y){const f=ols(Xrows,y);return {beta:f.beta,resid:f.resid,sse:f.sse,df:f.df,X:f.X,XtXinv:f.XtXinv};}
// Two-stage least squares with first-stage weak-instrument F (validated vs linearmodels)
function tsls(y,Xexog,Xendog,Z,opts){
  opts=opts||{};const n=y.length,ones=Array.from({length:n},()=>[1]);
  const exog=Xexog&&Xexog.length&&Xexog[0]?Xexog:Array.from({length:n},()=>[]);
  const p=Xendog[0].length,q=Z[0].length;
  const Winst=ones.map((o,i)=>[1,...exog[i],...Z[i]]);
  const WtWinv=invSym(math.multiply(math.transpose(Winst),Winst));
  const Px=col=>{const b=math.multiply(WtWinv,math.multiply(math.transpose(Winst),col));return Winst.map(r=>r.reduce((s,v,j)=>s+v*b[j],0));};
  const endogCols=[];for(let j=0;j<p;j++)endogCols.push(Xendog.map(r=>r[j]));
  const endogHat=endogCols.map(Px);
  const Wh=ones.map((o,i)=>[1,...exog[i],...endogHat.map(c=>c[i])]);
  const Wact=ones.map((o,i)=>[1,...exog[i],...endogCols.map(c=>c[i])]);
  const WhtWhinv=invSym(math.multiply(math.transpose(Wh),Wh));
  const beta=math.multiply(WhtWhinv,math.multiply(math.transpose(Wh),y));
  const yhat=Wact.map(r=>r.reduce((s,v,j)=>s+v*beta[j],0));
  const resid=y.map((v,i)=>v-yhat[i]);
  const {V,dfp}=vcov(Wh,resid,WhtWhinv,{type:opts.type||"classical",clusterIds:opts.clusterIds});
  const se=seFromV(V),t=beta.map((b,i)=>b/se[i]),pv=t.map(tt=>twoSidedP(Math.abs(tt),dfp));
  const firstF=[];
  for(let j=0;j<p;j++){const col=endogCols[j];const full=lmFit(ones.map((o,i)=>[...exog[i],...Z[i]]),col),restr=lmFit(ones.map((o,i)=>[...exog[i]]),col);const F=((restr.sse-full.sse)/q)/(full.sse/full.df);firstF.push({F,df1:q,df2:full.df,p:fSurv(F,q,full.df)});}
  const ybar=y.reduce((a,b)=>a+b,0)/n,sst=y.reduce((s,v)=>s+(v-ybar)**2,0),sse=resid.reduce((s,e)=>s+e*e,0);
  return {beta,se,t,p:pv,resid,n,k:Wh[0].length,dfp,r2:1-sse/sst,firstF,seType:opts.type||"classical"};
}
function durbinWatson(resid){let num=0,den=0;for(let i=1;i<resid.length;i++)num+=(resid[i]-resid[i-1])**2;for(let i=0;i<resid.length;i++)den+=resid[i]*resid[i];return den>0?num/den:NaN;}
function neweyWestSE(X,resid,XtXinv,L){
  const n=X.length,k=X[0].length;if(L==null)L=Math.floor(4*Math.pow(n/100,2/9));
  const zeros=()=>Array.from({length:k},()=>new Array(k).fill(0));
  let S=zeros();for(let i=0;i<n;i++)for(let a=0;a<k;a++)for(let b=0;b<k;b++)S[a][b]+=resid[i]*resid[i]*X[i][a]*X[i][b];
  for(let lag=1;lag<=L;lag++){const w=1-lag/(L+1),G=zeros();for(let i=lag;i<n;i++)for(let a=0;a<k;a++)for(let b=0;b<k;b++)G[a][b]+=resid[i]*resid[i-lag]*(X[i][a]*X[i-lag][b]+X[i-lag][a]*X[i][b]);for(let a=0;a<k;a++)for(let b=0;b<k;b++)S[a][b]+=w*G[a][b];}
  return seFromV(math.multiply(math.multiply(XtXinv,S),XtXinv));
}
function kpss(series,trend){
  trend=trend||"c";const n=series.length,t=series.map((_,i)=>i+1);
  const X=trend==="ct"?t.map(v=>[v]):series.map(()=>[]);
  const e=ols(X,series).resid;
  const S=[];let acc=0;for(let i=0;i<n;i++){acc+=e[i];S.push(acc);}
  const numer=S.reduce((s,v)=>s+v*v,0)/(n*n),l=Math.floor(4*Math.pow(n/100,0.25));
  let s2=e.reduce((s,v)=>s+v*v,0)/n;
  for(let lag=1;lag<=l;lag++){let g=0;for(let i=lag;i<n;i++)g+=e[i]*e[i-lag];g/=n;s2+=2*(1-lag/(l+1))*g;}
  const stat=numer/s2,cv=trend==="ct"?{p10:0.119,p5:0.146,p1:0.216}:{p10:0.347,p5:0.463,p1:0.739};
  return {stat,cv,trend,lags:l,nonstat5:stat>cv.p5,nonstat10:stat>cv.p10};
}
function vif(rowsX){const k=rowsX[0].length;if(k<2)return rowsX[0].map(()=>1);const out=[];for(let j=0;j<k;j++){const yj=rowsX.map(r=>r[j]);const others=rowsX.map(r=>r.filter((_,c)=>c!==j));try{const fit=ols(others,yj);out.push(1/Math.max(1e-9,1-fit.r2));}catch{out.push(NaN);}}return out;}
function pearsonRaw(xs,ys){const n=xs.length,mx=xs.reduce((a,b)=>a+b,0)/n,my=ys.reduce((a,b)=>a+b,0)/n;let cov=0,sx=0,sy=0;for(let i=0;i<n;i++){cov+=(xs[i]-mx)*(ys[i]-my);sx+=(xs[i]-mx)**2;sy+=(ys[i]-my)**2;}return cov/Math.sqrt(sx*sy);}
function pearson(xs,ys){const p=xs.map((x,i)=>[x,ys[i]]).filter(([a,b])=>isFinite(a)&&isFinite(b));if(p.length<3)return {r:NaN,n:p.length};return {r:pearsonRaw(p.map(q=>q[0]),p.map(q=>q[1])),n:p.length};}
function ranks(arr){const idx=arr.map((v,i)=>[v,i]).sort((a,b)=>a[0]-b[0]);const r=new Array(arr.length);let i=0;while(i<idx.length){let j=i;while(j+1<idx.length&&idx[j+1][0]===idx[i][0])j++;const avg=(i+j)/2+1;for(let k=i;k<=j;k++)r[idx[k][1]]=avg;i=j+1;}return r;}
function spearman(xs,ys){const p=xs.map((x,i)=>[x,ys[i]]).filter(([a,b])=>isFinite(a)&&isFinite(b));if(p.length<3)return {r:NaN,n:p.length};return {r:pearsonRaw(ranks(p.map(q=>q[0])),ranks(p.map(q=>q[1]))),n:p.length};}
function corrP(r,n){if(!isFinite(r)||n<3)return NaN;if(Math.abs(r)>=1)return 0;const t=r*Math.sqrt((n-2)/(1-r*r));return twoSidedP(Math.abs(t),n-2);}
function bh(pvals,alpha=0.05){const m=pvals.length,order=pvals.map((p,i)=>[p,i]).sort((a,b)=>a[0]-b[0]),q=new Array(m);let prev=1;for(let k=m-1;k>=0;k--){const [p,idx]=order[k];const val=Math.min(prev,p*m/(k+1));q[idx]=val;prev=val;}return {q,sig:pvals.map((p,i)=>q[i]<=alpha)};}
function backtest(series){const n=series.length,start=Math.max(4,Math.floor(n*0.5)),recs=[];for(let o=start;o<n;o++){const tr=series.slice(0,o),t=tr.map((_,i)=>i+1),fit=ols(t.map(v=>[v]),tr);recs.push({t:o+1,actual:series[o],pred:fit.beta[0]+fit.beta[1]*(o+1)});}if(!recs.length)return null;const errs=recs.map(r=>r.actual-r.pred);const mae=errs.reduce((s,e)=>s+Math.abs(e),0)/errs.length,rmse=Math.sqrt(errs.reduce((s,e)=>s+e*e,0)/errs.length);const naive=[];for(let o=start;o<n;o++)naive.push(Math.abs(series[o]-series[o-1]));const naiveMae=naive.reduce((a,b)=>a+b,0)/naive.length;return {recs,mae,rmse,naiveMae,k:recs.length};}
const fmt=(x,d=3)=>(x===null||x===undefined||!isFinite(x))?"—":Number(x).toLocaleString(undefined,{maximumFractionDigits:d,minimumFractionDigits:0});
const pStar=p=>p<0.01?"***":p<0.05?"**":p<0.1?"*":"";
const pct=x=>fmt(x*100,1)+"%";
const strengthWord=r=>{const a=Math.abs(r);return a<0.1?"negligible":a<0.3?"weak":a<0.5?"moderate":a<0.7?"strong":"very strong";};
const isLogVar=n=>/^(log_|ln_)/.test(n);
function diffSeries(s){return s.slice(1).map((v,i)=>v-s[i]);}
function adf(series,opts){
  opts=(opts&&typeof opts==="object")?opts:{};
  const trend=opts.trend==="ct"?"ct":"c";
  const n=series.length;let lags=opts.lags==null?Math.min(8,Math.max(1,Math.floor(Math.cbrt(n-1)))):opts.lags;
  if(n<lags+6)return null;
  const dy=diffSeries(series),Y=[],X=[];
  for(let t=lags+1;t<n;t++){const row=[series[t-1]];for(let i=1;i<=lags;i++)row.push(dy[t-1-i]);if(trend==="ct")row.push(t);Y.push(dy[t-1]);X.push(row);}
  if(Y.length<X[0].length+2)return null;
  const fit=ols(X,Y),tstat=fit.tstat[1];
  const cv=trend==="ct"?{p1:-3.96,p5:-3.41,p10:-3.12}:{p1:-3.43,p5:-2.86,p10:-2.57};
  return {tstat,cv,lags,trend,gamma:fit.beta[1],n:Y.length,reject5:tstat<cv.p5,reject10:tstat<cv.p10};
}
function transformCol(rows,src,op){
  const raw=rows.map(r=>{const v=r[src];return typeof v==="number"?v:parseFloat(String(v).replace(/[, ]/g,""));});
  const out=new Array(rows.length).fill("");
  if(op==="ln"){for(let i=0;i<raw.length;i++)out[i]=raw[i]>0?+Math.log(raw[i]).toFixed(6):"";return {prefix:"log_",vals:out};}
  if(op==="growth"){for(let i=1;i<raw.length;i++){if(isFinite(raw[i])&&isFinite(raw[i-1])&&raw[i-1]!==0)out[i]=+(100*(raw[i]-raw[i-1])/raw[i-1]).toFixed(4);}return {prefix:"growth_",vals:out};}
  if(op==="diff"){for(let i=1;i<raw.length;i++){if(isFinite(raw[i])&&isFinite(raw[i-1]))out[i]=+(raw[i]-raw[i-1]).toFixed(6);}return {prefix:"diff_",vals:out};}
  if(op==="z"){const v=raw.filter(isFinite),m=v.reduce((a,b)=>a+b,0)/v.length,sd=Math.sqrt(v.reduce((s,x)=>s+(x-m)**2,0)/(v.length-1));for(let i=0;i<raw.length;i++)out[i]=isFinite(raw[i])&&sd>0?+((raw[i]-m)/sd).toFixed(4):"";return {prefix:"z_",vals:out};}
  if(op==="lag1"){for(let i=1;i<raw.length;i++)out[i]=isFinite(raw[i-1])?raw[i-1]:"";return {prefix:"lag1_",vals:out};}
  return {prefix:"t_",vals:out};
}

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function sampleCrossSection(){
  const rng=mulberry32(11);const rows=[];
  for(let i=0;i<48;i++){const income=Math.round(3200+rng()*52000);const life=+(48+7.4*Math.log(income/3200)+(rng()-0.5)*4.6).toFixed(1);const health=Math.round(income*0.071+(rng()-0.5)*520);const urban=+Math.min(98,Math.max(7,22+58*(income/55000)+(rng()-0.5)*22)).toFixed(1);const climate=["Temperate","Tropical","Arid","Continental"][Math.floor(rng()*4)];rows.push({region:"R"+String(i+1).padStart(2,"0"),income_pc:income,life_exp:life,health_pc:health,urban_pct:urban,climate});}
  return {name:"Regions cross-section",rows,fields:["region","income_pc","life_exp","health_pc","urban_pct","climate"]};
}
function sampleTimeSeries(){
  const rng=mulberry32(5);const rows=[];
  for(let t=1;t<=54;t++)rows.push({period:t,value:+(102+0.92*t+7*Math.sin(2*Math.PI*t/12)+(rng()-0.5)*7.5).toFixed(1),volume:Math.round(800+12*t+(rng()-0.5)*240)});
  return {name:"Monthly indicator",rows,fields:["period","value","volume"]};
}
function inferColumns(rows,fields,overrides){
  overrides=overrides||{};
  return fields.map(f=>{
    let numeric=0,miss=0;const total=rows.length,vals=[];
    for(const r of rows){const raw=r[f];if(raw===null||raw===undefined||raw===""){miss++;continue;}const num=typeof raw==="number"?raw:parseFloat(String(raw).replace(/[, ]/g,""));if(!isNaN(num)&&String(raw).trim()!==""&&/^-?[\d.,\s]+$/.test(String(raw))){numeric++;vals.push(num);}}
    const ov=overrides[f];
    const isNum=ov==="numeric"?vals.length>0:ov==="categorical"?false:(numeric>0&&numeric>=(total-miss)*0.9);
    let stats=null;
    if(isNum&&vals.length){const mean=vals.reduce((a,b)=>a+b,0)/vals.length;const sd=Math.sqrt(vals.reduce((s,v)=>s+(v-mean)**2,0)/Math.max(1,vals.length-1));const sk=sd>0?vals.reduce((s,v)=>s+((v-mean)/sd)**3,0)/vals.length:0;stats={mean,sd,min:Math.min(...vals),max:Math.max(...vals),n:vals.length,skew:sk};}
    return {field:f,type:isNum?"numeric":"categorical",missing:miss,total,stats,overridden:!!ov};
  });
}
function numericCol(rows,f){return rows.map(r=>{const v=r[f];return typeof v==="number"?v:parseFloat(String(v).replace(/[, ]/g,""));}).filter(v=>!isNaN(v));}
function downloadText(name,text,mime){const blob=new Blob([text],{type:mime||"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function buildReport(ds,cols,blocks){
  const L=[];L.push("# "+ds.name+" — analysis report","","Generated by Candor · "+ds.rows.length+" rows × "+ds.fields.length+" columns.","");
  L.push("## Descriptive statistics","","| column | type | missing | mean | sd | min | max |","|---|---|---|---|---|---|---|");
  cols.forEach(c=>L.push("| "+c.field+" | "+c.type+" | "+c.missing+" | "+(c.stats?fmt(c.stats.mean,3):"—")+" | "+(c.stats?fmt(c.stats.sd,3):"—")+" | "+(c.stats?fmt(c.stats.min,3):"—")+" | "+(c.stats?fmt(c.stats.max,3):"—")+" |"));
  const num=cols.filter(c=>c.type==="numeric").map(c=>c.field);
  if(num.length>=2){const pairs=[];for(let i=0;i<num.length;i++)for(let j=i+1;j<num.length;j++){const pr=pearson(numericCol(ds.rows,num[i]),numericCol(ds.rows,num[j]));pairs.push({a:num[i],b:num[j],r:pr.r,p:corrP(pr.r,pr.n)});}const res=bh(pairs.map(p=>p.p));pairs.forEach((p,i)=>{p.q=res.q[i];p.sig=res.sig[i];});pairs.sort((x,y)=>Math.abs(y.r)-Math.abs(x.r));L.push("","## Correlations — Pearson, with Benjamini–Hochberg FDR","","| pair | r | p | q (BH) | FDR 5% |","|---|---|---|---|---|");pairs.slice(0,12).forEach(p=>L.push("| "+p.a+" × "+p.b+" | "+fmt(p.r,3)+" | "+fmt(p.p,4)+" | "+fmt(p.q,4)+" | "+(p.sig?"yes":"")+" |"));L.push("",pairs.filter(p=>p.sig).length+" of "+pairs.length+" pairs survive a 5% false-discovery-rate correction.");}
  const analytic=(blocks||[]).filter(b=>["regression","iv","did","forecast","stationarity"].includes(b.vizId));
  if(analytic.length){L.push("","## Models & tests in this document","");analytic.forEach((b,i)=>{const v=VIZ[b.vizId];L.push("**"+(i+1)+". "+(v?v.name:b.vizId)+"** — "+blockResult(b,ds,cols),"");});}
  L.push("","## Caveats","","- Correlation is not causation; OLS coefficients are associations unless a credible identification strategy (IV, DiD) is used.","- IV requires a relevant (first-stage F>10) and excludable instrument; DiD requires parallel trends — both partly untestable.","- Summaries assume the sample is representative; forecasts are linear-trend baselines with optimistic intervals under autocorrelation.");
  return L.join("\n");
}
const STORAGE_KEY="candor_docs_v2";
function hasSandboxStore(){try{return typeof window!=="undefined"&&window.storage&&typeof window.storage.set==="function";}catch{return false;}}
function hasLocalStore(){try{return typeof window!=="undefined"&&!!window.localStorage;}catch{return false;}}
function hasStore(){return hasSandboxStore()||hasLocalStore();}
async function loadStore(){
  if(hasSandboxStore()){try{const r=await window.storage.get(STORAGE_KEY,false);if(r&&r.value)return JSON.parse(r.value);}catch{}}
  if(hasLocalStore()){try{const v=window.localStorage.getItem(STORAGE_KEY);if(v)return JSON.parse(v);}catch{}}
  return null;
}
async function saveStore(docs){
  let ok=false;const payload=JSON.stringify(docs);
  if(hasSandboxStore()){try{await window.storage.set(STORAGE_KEY,payload,false);ok=true;}catch{}}
  if(hasLocalStore()){try{window.localStorage.setItem(STORAGE_KEY,payload);ok=true;}catch{}}
  return ok;
}
const uid=p=>(p||"id")+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const newDoc=(name,template)=>({id:uid("d"),name,template:template||null,dataset:null,blocks:[]});

const WB_INDICATORS=[
  {code:"NY.GDP.PCAP.CD",name:"gdp_pc",label:"GDP per capita (US$)"},
  {code:"NY.GDP.MKTP.CD",name:"gdp_usd",label:"GDP (current US$)"},
  {code:"NY.GDP.MKTP.KD.ZG",name:"gdp_growth",label:"GDP growth (annual %)"},
  {code:"FP.CPI.TOTL.ZG",name:"inflation",label:"Inflation, CPI (annual %)"},
  {code:"SL.UEM.TOTL.ZS",name:"unemployment",label:"Unemployment (% labor force)"},
  {code:"SP.POP.TOTL",name:"population",label:"Population, total"},
  {code:"NE.TRD.GNFS.ZS",name:"trade_pct_gdp",label:"Trade (% of GDP)"},
  {code:"SP.DYN.LE00.IN",name:"life_exp",label:"Life expectancy (years)"},
];
const WB_COUNTRIES=[
  {iso:"USA",name:"United States"},{iso:"CHN",name:"China"},{iso:"JPN",name:"Japan"},{iso:"DEU",name:"Germany"},{iso:"GBR",name:"United Kingdom"},{iso:"FRA",name:"France"},{iso:"IND",name:"India"},{iso:"BRA",name:"Brazil"},{iso:"CAN",name:"Canada"},{iso:"ITA",name:"Italy"},{iso:"KOR",name:"South Korea"},{iso:"MEX",name:"Mexico"},{iso:"ESP",name:"Spain"},{iso:"AUS",name:"Australia"},{iso:"NGA",name:"Nigeria"},{iso:"ZAF",name:"South Africa"},{iso:"IDN",name:"Indonesia"},{iso:"TUR",name:"Türkiye"},
];
const FRED_PRESETS=[["GDPC1","Real GDP"],["CPIAUCSL","CPI (all items)"],["UNRATE","Unemployment rate"],["FEDFUNDS","Fed funds rate"],["GS10","10-yr Treasury yield"],["PAYEMS","Nonfarm payrolls"],["M2SL","M2 money stock"],["DEXUSEU","USD/EUR exchange rate"]];
const BLS_PRESETS=[["CUUR0000SA0","CPI-U, all items"],["LNS14000000","Unemployment rate"],["CES0000000001","Total nonfarm employment"],["WPUFD4","PPI final demand"]];

async function fetchWorldBank(ind,countries){
  const rows=[];
  for(const c of countries){
    const url="https://api.worldbank.org/v2/country/"+c.iso+"/indicator/"+ind.code+"?format=json&per_page=20000&date=1990:2024";
    const res=await fetch(url);
    if(!res.ok)throw new Error("World Bank returned HTTP "+res.status);
    const data=await res.json();
    const arr=Array.isArray(data)&&data[1]?data[1]:[];
    arr.forEach(d=>{if(d.value!=null)rows.push({country:c.name,year:+d.date,[ind.name]:+(+d.value).toFixed(4)});});
  }
  if(!rows.length)throw new Error("No observations returned for that selection.");
  rows.sort((a,b)=>a.country===b.country?a.year-b.year:a.country.localeCompare(b.country));
  return {name:ind.label+" — World Bank",rows,fields:["country","year",ind.name]};
}
async function fetchFred(series){
  const id=series.trim();
  const res=await fetch("/api/fred?series="+encodeURIComponent(id));
  const data=await res.json();
  if(!res.ok)throw new Error(data.error||("FRED proxy HTTP "+res.status));
  if(!data.rows||!data.rows.length)throw new Error("No rows returned — check the series ID.");
  const rows=data.rows.map(o=>({date:o.date,[id]:o.value}));
  return {name:id+" — FRED",rows,fields:["date",id]};
}
async function fetchBls(series){
  const id=series.trim();
  const res=await fetch("/api/bls?series="+encodeURIComponent(id));
  const data=await res.json();
  if(!res.ok)throw new Error(data.error||("BLS proxy HTTP "+res.status));
  const s=data.series&&data.series[0];
  if(!s||!s.rows||!s.rows.length)throw new Error("No series data returned — check the series ID.");
  const rows=s.rows.map(d=>({date:d.date,value:d.value}));
  return {name:id+" — BLS",rows,fields:["date","value"]};
}

const th={padding:"8px 10px",textAlign:"left",fontWeight:600,fontSize:11,color:T.muted};
const td={padding:"7px 10px",textAlign:"left"};
const tipStyle={fontFamily:"IBM Plex Mono",fontSize:11.5,border:"1px solid "+T.line,borderRadius:4,background:"#fff"};
const tk={fontSize:10,fontFamily:"IBM Plex Mono",fill:T.muted};
function Note({children}){return <div className="card" style={{padding:"14px 16px",fontSize:13.5,color:T.muted}}>{children}</div>;}
function ChartBox({title,children}){
  const ref=useRef(null);
  function dl(){const svg=ref.current&&ref.current.querySelector("svg");if(!svg)return;const c=svg.cloneNode(true);c.setAttribute("xmlns","http://www.w3.org/2000/svg");downloadText((title||"chart").replace(/[^\w]+/g,"_").slice(0,40)+".svg",new XMLSerializer().serializeToString(c),"image/svg+xml");}
  return (<div className="card" style={{padding:"12px 12px 6px",marginBottom:12}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 4px 8px",gap:8}}><span className="fmono" style={{fontSize:11,color:T.muted,letterSpacing:"0.03em"}}>{title}</span><button className="iconbtn" onClick={dl} title="Download chart (SVG)"><Download size={13}/></button></div>
    <div ref={ref}>{children}</div></div>);
}
function Selector({label,value,onChange,options}){
  return (<label style={{display:"block"}}><div className="fmono" style={{fontSize:10.5,color:T.muted,marginBottom:5,letterSpacing:"0.05em"}}>{label.toUpperCase()}</div>
    <select value={value} onChange={e=>onChange(e.target.value)} style={{padding:"8px 11px",border:"1px solid "+T.line,borderRadius:4,fontFamily:"IBM Plex Mono",fontSize:13,background:"#fff",minWidth:140,color:T.ink}}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select></label>);
}
function Toggle({label,value,onChange,options}){
  return (<div><div className="fmono" style={{fontSize:10.5,color:T.muted,marginBottom:5,letterSpacing:"0.05em"}}>{label.toUpperCase()}</div>
    <div style={{display:"flex",gap:3}}>{options.map(o=>(<button key={o} onClick={()=>onChange(o)} className="btn btn-sm fmono" style={{fontSize:12,background:value===o?T.interval:"transparent",color:value===o?"#fff":T.muted,border:value===o?"none":"1px solid "+T.line}}>{o}</button>))}</div></div>);
}
function Reading({children,caveat}){
  return (<div className="card" style={{padding:0,overflow:"hidden",marginBottom:2}}>
    <div style={{borderLeft:"3px solid "+T.interval,padding:"13px 15px"}}><div className="eyebrow" style={{marginBottom:7,fontSize:10}}>Reading this</div><div style={{fontSize:13.5,lineHeight:1.58,color:T.ink}}>{children}</div></div>
    {caveat&&(<div style={{background:T.paper,borderTop:"1px solid "+T.line,padding:"9px 15px",display:"flex",gap:8,alignItems:"flex-start"}}><AlertTriangle size={13} style={{color:T.point,marginTop:2,flexShrink:0}}/><span style={{fontSize:12,color:T.muted,lineHeight:1.5}}>{caveat}</span></div>)}
  </div>);
}
function guard(val,opts,fallback){return opts.includes(val)?val:(opts[fallback||0]||"");}

function VizSummary({dataset,cols}){
  const highMiss=cols.filter(c=>c.missing/c.total>0.1),skewed=cols.filter(c=>c.stats&&Math.abs(c.stats.skew)>1);
  const outl=cols.map(c=>{if(!c.stats)return 0;const v=numericCol(dataset.rows,c.field);return v.filter(x=>Math.abs(x-c.stats.mean)>3*c.stats.sd).length;});
  const outCols=cols.map((c,i)=>({c,n:outl[i]})).filter(o=>o.n>0);
  return (<div>
    <div className="card" style={{overflow:"hidden",marginBottom:10,overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontFamily:"IBM Plex Mono",fontSize:12}}>
      <thead><tr style={{background:T.paper}}>{["column","type","missing","mean","sd","cv","min","max","outliers"].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
      <tbody>{cols.map((c,i)=>(<tr key={i} style={{borderTop:"1px solid "+T.line}}><td style={{...td,fontWeight:600}}>{c.field}</td><td style={td}><span style={{color:c.type==="numeric"?T.interval:T.point}}>{c.type}</span></td><td style={{...td,color:c.missing/c.total>0.1?T.point:T.ink}}>{c.missing}</td><td style={td}>{c.stats?fmt(c.stats.mean,2):"—"}</td><td style={td}>{c.stats?fmt(c.stats.sd,2):"—"}</td><td style={td}>{c.stats&&c.stats.mean!==0?fmt(c.stats.sd/Math.abs(c.stats.mean),2):"—"}</td><td style={td}>{c.stats?fmt(c.stats.min,2):"—"}</td><td style={td}>{c.stats?fmt(c.stats.max,2):"—"}</td><td style={{...td,color:outl[i]>0?T.point:T.muted}}>{c.stats?outl[i]:"—"}</td></tr>))}</tbody>
    </table></div>
    <Reading caveat="Descriptive statistics describe this sample only — no causal meaning. The coefficient of variation (cv = sd/mean) compares dispersion across differently-scaled series; outliers are values beyond 3 sd.">{dataset.rows.length} rows across {cols.filter(c=>c.type==="numeric").length} numeric and {cols.filter(c=>c.type==="categorical").length} categorical columns. {highMiss.length>0?<>Missing values are heavy in <strong>{highMiss.map(c=>c.field).join(", ")}</strong>. </>:<>No column exceeds 10% missing. </>}{outCols.length>0?<>Possible outliers (&gt;3 sd) in <strong>{outCols.map(o=>o.c.field+" ("+o.n+")").join(", ")}</strong> — inspect before modelling. </>:<>No values lie beyond 3 sd. </>}{skewed.length>0&&<><strong>{skewed.map(c=>c.field).join(", ")}</strong> {skewed.length>1?"are":"is"} skewed — a log transform often helps.</>}</Reading>
  </div>);
}
function VizPreview({dataset}){
  const preview=dataset.rows.slice(0,10);
  return (<ChartBox title="First 10 rows"><div style={{overflowX:"auto"}}><table style={{borderCollapse:"collapse",fontFamily:"IBM Plex Mono",fontSize:11.5,minWidth:"100%"}}><thead><tr style={{background:T.paper}}>{dataset.fields.map(f=><th key={f} style={{...th,whiteSpace:"nowrap"}}>{f}</th>)}</tr></thead><tbody>{preview.map((r,i)=>(<tr key={i} style={{borderTop:"1px solid "+T.line}}>{dataset.fields.map(f=><td key={f} style={{...td,whiteSpace:"nowrap"}}>{String(r[f]==null?"":r[f])}</td>)}</tr>))}</tbody></table></div></ChartBox>);
}
function VizHistogram({dataset,cols,config,onConfig}){
  const nums=cols.filter(c=>c.type==="numeric").map(c=>c.field);if(!nums.length)return <Note>No numeric columns to plot.</Note>;
  const x=guard(config.x,nums);const v=numericCol(dataset.rows,x);
  const min=Math.min(...v),max=Math.max(...v),k=Math.min(14,Math.max(4,Math.ceil(Math.sqrt(v.length)))),w=(max-min)/k||1;
  const arr=Array.from({length:k},(_,i)=>({bin:(min+i*w).toFixed(1),count:0}));v.forEach(val=>{arr[Math.min(k-1,Math.floor((val-min)/w))].count++;});
  const mean=v.reduce((a,b)=>a+b,0)/v.length,sd=Math.sqrt(v.reduce((s,val)=>s+(val-mean)**2,0)/(v.length-1)),sk=sd>0?v.reduce((s,val)=>s+((val-mean)/sd)**3,0)/v.length:0;
  return (<div><div style={{marginBottom:12}}><Selector label="column" value={x} onChange={c=>onConfig({x:c})} options={nums}/></div>
    <ChartBox title={"Distribution of "+x}><ResponsiveContainer width="100%" height={230}><BarChart data={arr} margin={{top:8,right:14,bottom:22,left:6}}><CartesianGrid stroke={T.line} strokeDasharray="2 3" vertical={false}/><XAxis dataKey="bin" tick={{fontSize:9,fontFamily:"IBM Plex Mono",fill:T.muted}} angle={-30} textAnchor="end" height={42}/><YAxis tick={tk} width={36}/><Tooltip contentStyle={tipStyle}/><Bar dataKey="count" radius={[2,2,0,0]}>{arr.map((_,i)=><Cell key={i} fill={T.interval} fillOpacity={0.78}/>)}</Bar></BarChart></ResponsiveContainer></ChartBox>
    <Reading caveat="Bin counts shift with bin width; skewness and outliers distort mean-based summaries.">{x} has mean <strong>{fmt(mean,2)}</strong>, sd <strong>{fmt(sd,2)}</strong> over {v.length} values, and is <strong>{Math.abs(sk)<0.5?"roughly symmetric":sk>0?"right-skewed":"left-skewed"}</strong> (skew {fmt(sk,2)}).</Reading></div>);
}
function VizScatter({dataset,cols,config,onConfig}){
  const nums=cols.filter(c=>c.type==="numeric").map(c=>c.field);if(nums.length<2)return <Note>Need two numeric columns.</Note>;
  const x=guard(config.x,nums,0),y=guard(config.y,nums,1),fit=config.fit==="on";
  const pts=dataset.rows.map(r=>({x:Number(r[x]),y:Number(r[y])})).filter(d=>isFinite(d.x)&&isFinite(d.y));
  const pr=pearson(pts.map(p=>p.x),pts.map(p=>p.y));
  let line=null,model=null;
  if(fit&&pts.length>2){const f=ols(pts.map(p=>[p.x]),pts.map(p=>p.y));model=f;line=[...pts].sort((a,b)=>a.x-b.x).map(p=>({x:p.x,y:p.y,fit:f.beta[0]+f.beta[1]*p.x}));}
  return (<div><div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12,alignItems:"flex-end"}}><Selector label="x" value={x} onChange={c=>onConfig({x:c})} options={nums}/><Selector label="y" value={y} onChange={c=>onConfig({y:c})} options={nums}/><Toggle label="trend line" value={fit?"on":"off"} onChange={v=>onConfig({fit:v})} options={["off","on"]}/></div>
    <ChartBox title={y+" vs "+x}><ResponsiveContainer width="100%" height={250}><ComposedChart data={fit?line:pts} margin={{top:8,right:14,bottom:24,left:6}}><CartesianGrid stroke={T.line} strokeDasharray="2 3"/><XAxis dataKey="x" type="number" domain={["auto","auto"]} tick={tk} label={{value:x,position:"bottom",offset:6,fontSize:11,fill:T.muted}}/><YAxis dataKey="y" type="number" tick={tk} width={46} label={{value:y,angle:-90,position:"insideLeft",fontSize:11,fill:T.muted}}/><Tooltip contentStyle={tipStyle} formatter={v=>fmt(v,2)}/><Scatter dataKey="y" fill={T.interval} fillOpacity={0.7}/>{fit&&<Line dataKey="fit" stroke={T.point} strokeWidth={2.2} dot={false}/>}</ComposedChart></ResponsiveContainer></ChartBox>
    <Reading caveat="Correlation is an association, not a cause — a lurking variable, reverse causation, or selection could produce it.">Across <strong>{pr.n}</strong> pairs, {x} and {y} show a <strong>{strengthWord(pr.r)} {pr.r>=0?"positive":"negative"}</strong> correlation (r = {fmt(pr.r,2)}). {model&&<>The fitted line: each +1 in {x} maps to {model.beta[1]>=0?"+":""}{fmt(model.beta[1],3)} in {y} (R² {fmt(model.r2,2)}).</>}</Reading></div>);
}
function VizBar({dataset,cols,config,onConfig}){
  const nums=cols.filter(c=>c.type==="numeric").map(c=>c.field),cats=cols.filter(c=>c.type==="categorical").map(c=>c.field);
  if(!cats.length||!nums.length)return <Note>Need one categorical and one numeric column.</Note>;
  const cat=guard(config.cat,cats),y=guard(config.y,nums),agg=guard(config.agg,["mean","sum","count"]);
  const groups=new Map();dataset.rows.forEach(r=>{const key=String(r[cat]==null?"—":r[cat]),val=Number(r[y]);if(!isFinite(val))return;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(val);});
  let arr=[...groups.entries()].map(e=>({cat:e[0],value:agg==="mean"?e[1].reduce((a,b)=>a+b,0)/e[1].length:agg==="sum"?e[1].reduce((a,b)=>a+b,0):e[1].length}));arr.sort((a,b)=>b.value-a.value);if(arr.length>15)arr=arr.slice(0,15);const top=arr[0],bot=arr[arr.length-1];
  return (<div><div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}><Selector label="category" value={cat} onChange={c=>onConfig({cat:c})} options={cats}/><Selector label="value" value={y} onChange={c=>onConfig({y:c})} options={nums}/><Selector label="aggregate" value={agg} onChange={c=>onConfig({agg:c})} options={["mean","sum","count"]}/></div>
    <ChartBox title={agg+" of "+y+" by "+cat}><ResponsiveContainer width="100%" height={Math.max(200,arr.length*26)}><BarChart data={arr} layout="vertical" margin={{top:8,right:18,bottom:8,left:6}}><CartesianGrid stroke={T.line} strokeDasharray="2 3" horizontal={false}/><XAxis type="number" tick={tk}/><YAxis type="category" dataKey="cat" tick={{fontSize:10,fontFamily:"IBM Plex Mono",fill:T.muted}} width={90}/><Tooltip contentStyle={tipStyle} formatter={v=>fmt(v,2)}/><Bar dataKey="value" radius={[0,2,2,0]}>{arr.map((_,i)=><Cell key={i} fill={T.interval} fillOpacity={0.78}/>)}</Bar></BarChart></ResponsiveContainer></ChartBox>
    <Reading caveat="Group sizes can differ a lot; a high value from a tiny group is far less reliable.">By {agg}, <strong>{top.cat}</strong> is highest ({fmt(top.value,2)}) and <strong>{bot.cat}</strong> lowest ({fmt(bot.value,2)}) for {y}. Descriptive only — it doesn't isolate the effect of {cat}.</Reading></div>);
}
function VizLine({dataset,cols,config,onConfig}){
  const nums=cols.filter(c=>c.type==="numeric").map(c=>c.field);if(!nums.length)return <Note>Need a numeric column.</Note>;
  const y=guard(config.y,nums);const series=dataset.rows.map((r,i)=>({t:i+1,v:Number(r[y])})).filter(d=>isFinite(d.v));const first=series[0]&&series[0].v,last=series.length&&series[series.length-1].v;
  return (<div><div style={{marginBottom:12}}><Selector label="series" value={y} onChange={c=>onConfig({y:c})} options={nums}/></div>
    <ChartBox title={y+" in row order"}><ResponsiveContainer width="100%" height={240}><LineChart data={series} margin={{top:8,right:14,bottom:22,left:6}}><CartesianGrid stroke={T.line} strokeDasharray="2 3"/><XAxis dataKey="t" tick={tk} label={{value:"row",position:"bottom",offset:6,fontSize:11,fill:T.muted}}/><YAxis tick={tk} width={46} domain={["auto","auto"]}/><Tooltip contentStyle={tipStyle} formatter={v=>fmt(v,2)}/><Line dataKey="v" stroke={T.ink} strokeWidth={2.2} dot={false}/></LineChart></ResponsiveContainer></ChartBox>
    <Reading caveat="Row order is treated as time — if rows aren't time-ordered, sort first.">Over {series.length} points, {y} moves from <strong>{fmt(first,2)}</strong> to <strong>{fmt(last,2)}</strong> ({last>=first?"a net rise":"a net fall"} of {fmt(Math.abs(last-first),2)}).</Reading></div>);
}

function VizCorrelation({dataset,cols,config,onConfig}){
  const nums=cols.filter(c=>c.type==="numeric").map(c=>c.field);if(nums.length<2)return <Note>Need at least two numeric columns.</Note>;
  const method=guard(config.method,["Pearson","Spearman"]);const corr=method==="Pearson"?pearson:spearman;
  const matrix=nums.map(a=>nums.map(b=>corr(numericCol(dataset.rows,a),numericCol(dataset.rows,b)).r));
  const pr=[];for(let i=0;i<nums.length;i++)for(let j=i+1;j<nums.length;j++){const c=corr(numericCol(dataset.rows,nums[i]),numericCol(dataset.rows,nums[j]));pr.push({a:nums[i],b:nums[j],r:c.r,p:corrP(c.r,c.n)});}
  const res=bh(pr.map(p=>p.p));pr.forEach((p,i)=>{p.q=res.q[i];p.sig=res.sig[i];});pr.sort((x,y)=>Math.abs(y.r)-Math.abs(x.r));const pairs=pr.filter(p=>isFinite(p.r));
  const cellColor=r=>{if(!isFinite(r))return T.paper;const a=Math.min(1,Math.abs(r));return r>=0?"rgba(44,110,143,"+(0.1+0.8*a)+")":"rgba(192,131,42,"+(0.1+0.8*a)+")";};
  const top=pairs[0],survivors=pairs.filter(p=>p.sig),redundant=pairs.filter(p=>Math.abs(p.r)>0.9);
  return (<div><div style={{marginBottom:12}}><Toggle label="method" value={method} onChange={m=>onConfig({method:m})} options={["Pearson","Spearman"]}/></div>
    <div className="card" style={{padding:"14px 14px 8px",marginBottom:10,overflowX:"auto"}}><table style={{borderCollapse:"collapse",fontFamily:"IBM Plex Mono",fontSize:11}}><thead><tr><th style={{...th,position:"sticky",left:0,background:T.surface}}></th>{nums.map(c=><th key={c} style={{...th,minWidth:60,textAlign:"center"}}>{c}</th>)}</tr></thead>
      <tbody>{nums.map((a,i)=>(<tr key={a}><td style={{...td,fontWeight:600,position:"sticky",left:0,background:T.surface}}>{a}</td>{nums.map((b,j)=>{const r=matrix[i][j];return (<td key={b} style={{padding:0}}><div title={a+" × "+b+": r="+fmt(r,2)} style={{background:cellColor(r),textAlign:"center",padding:"9px 6px",color:Math.abs(r)>0.6?"#fff":T.ink,fontWeight:i===j?700:400}}>{i===j?"1":fmt(r,2)}</div></td>);})}</tr>))}</tbody></table>
      <div style={{display:"flex",gap:12,marginTop:9,alignItems:"center",flexWrap:"wrap"}}><span className="fmono" style={{fontSize:10,color:T.muted}}>neg</span><span style={{display:"flex"}}>{[-0.9,-0.5,0,0.5,0.9].map((r,i)=><span key={i} style={{width:20,height:11,background:cellColor(r)}}/>)}</span><span className="fmono" style={{fontSize:10,color:T.muted}}>pos</span></div></div>
    <Reading caveat="Correlation is blind to cause and direction. Strong pairs are leads, not conclusions.">Strongest: <strong>{top.a}</strong> & <strong>{top.b}</strong> ({strengthWord(top.r)} {top.r>=0?"positive":"negative"}, r {fmt(top.r,2)}, q {fmt(top.q,3)}). Of {pairs.length} pairs, <strong>{survivors.length}</strong> survive a 5% Benjamini–Hochberg correction. {redundant.length>0&&<>Above 0.9: {redundant.map(p=>p.a+"–"+p.b).join(", ")} — near-duplicate, a multicollinearity risk.</>}</Reading></div>);
}
function VizRegression({dataset,cols,config,onConfig}){
  const nums=cols.filter(c=>c.type==="numeric").map(c=>c.field),catsAll=cols.filter(c=>c.type==="categorical").map(c=>c.field);
  if(nums.length<2)return <Note>Regression needs at least two numeric columns.</Note>;
  const y=guard(config.y,nums,1);const seOpts=["Classical","HC1","HC2","HC3","Cluster"];const seType=guard(config.se,seOpts,1);
  const typeMap={Classical:"classical",HC1:"HC1",HC2:"HC2",HC3:"HC3",Cluster:"cluster"};
  const clusterBy=seType==="Cluster"?(config.cluster&&catsAll.includes(config.cluster)?config.cluster:catsAll[0]||null):null;
  let numPreds=(config.preds||[]).filter(p=>nums.includes(p)&&p!==y);if(!numPreds.length&&!(config.cats||[]).length)numPreds=[nums.find(c=>c!==y)].filter(Boolean);
  const catPreds=(config.cats||[]).filter(c=>catsAll.includes(c));
  const catLevels={};catPreds.forEach(cp=>{catLevels[cp]=[...new Set(dataset.rows.map(r=>String(r[cp]==null?"":r[cp])).filter(s=>s!==""))].sort();});
  const dummyTerms=catPreds.flatMap(cp=>catLevels[cp].slice(1).map(lv=>cp+"="+lv));
  const termNames=[...numPreds,...dummyTerms];
  const head=<RegHead y={y} nums={nums} cats={catsAll} numPreds={numPreds} catPreds={catPreds} seType={seType} seOpts={seOpts} clusterBy={clusterBy} onConfig={onConfig}/>;
  if(!termNames.length)return <div>{head}<Note>Pick at least one predictor (numeric or categorical).</Note></div>;
  const data=[];
  for(const r of dataset.rows){const yv=Number(r[y]);if(!isFinite(yv))continue;const nv=numPreds.map(p=>Number(r[p]));if(!nv.every(isFinite))continue;let ok=true;const dv=[];for(const cp of catPreds){const val=String(r[cp]==null?"":r[cp]);if(val===""){ok=false;break;}catLevels[cp].slice(1).forEach(lv=>dv.push(val===lv?1:0));}if(!ok)continue;let cid=null;if(clusterBy){cid=String(r[clusterBy]==null?"":r[clusterBy]);if(cid==="")continue;}data.push({y:yv,x:[...nv,...dv],cid});}
  const dropped=dataset.rows.length-data.length;
  if(data.length<termNames.length+2)return <div>{head}<Note>Not enough complete rows for this model.</Note></div>;
  const clusterFell=seType==="Cluster"&&!clusterBy;
  const useType=clusterFell?"HC1":typeMap[seType];
  const fit=regress(data.map(d=>d.x),data.map(d=>d.y),{type:useType,clusterIds:clusterBy?data.map(d=>d.cid):null});
  const vifs=termNames.length>=2?vif(data.map(d=>d.x)):termNames.map(()=>1);
  const SE=fit.se,TT=fit.t,PP=fit.p;
  const seLabel=clusterFell?"HC1 robust":useType==="cluster"?("cluster-robust ("+fit.G+" clusters of "+clusterBy+")"):useType==="classical"?"classical":useType+" robust";
  const fewClusters=useType==="cluster"&&fit.G<20;
  const single=numPreds.length===1&&catPreds.length===0;
  const sorted=single?[...data].sort((a,b)=>a.x[0]-b.x[0]).map(d=>({x:d.x[0],y:d.y,fit:fit.beta[0]+fit.beta[1]*d.x[0]})):null;
  const resid=data.map((d,i)=>({fitted:fit.yhat[i],resid:fit.resid[i]}));
  const terms=["(intercept)",...termNames],smallN=fit.n<Math.max(30,10*fit.k),hiVif=vifs.some(v=>v>5);
  let elast=null;
  if(single){const x0=numPreds[0];if(isLogVar(y)&&isLogVar(x0))elast=<>This is a <strong>log–log</strong> model, so the coefficient is an <strong>elasticity</strong>: a 1% rise in {x0} is associated with about <strong>{fmt(fit.beta[1],3)}%</strong> change in {y}. </>;else if(isLogVar(y))elast=<>Since {y} is logged, a one-unit rise in {x0} maps to roughly <strong>{fmt(100*fit.beta[1],2)}%</strong> change in {y} (a semi-elasticity). </>;}
  return (<div>{head}
    {clusterFell&&<Note>No categorical column to cluster on — showing HC1 robust SEs instead.</Note>}
    <div className="card" style={{padding:"12px 14px",marginBottom:10,overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontFamily:"IBM Plex Mono",fontSize:12,minWidth:380}}><thead><tr style={{color:T.muted}}>{["term","coef.","s.e.","t","p",""].concat(termNames.length>=2?["VIF"]:[]).map((h,i)=><th key={i} style={{...th,background:"none",borderBottom:"1px solid "+T.line}}>{h}</th>)}</tr></thead>
      <tbody>{terms.map((term,i)=>(<tr key={i}><td style={td}>{term}</td><td style={td}>{fmt(fit.beta[i])}</td><td style={td}>{fmt(SE[i])}</td><td style={td}>{fmt(TT[i],2)}</td><td style={td}>{fmt(PP[i],4)}</td><td style={{...td,color:T.point}}>{pStar(PP[i])}</td>{termNames.length>=2&&<td style={{...td,color:i>0&&vifs[i-1]>5?T.point:T.ink}}>{i===0?"—":fmt(vifs[i-1],2)}</td>}</tr>))}</tbody></table>
      <div style={{display:"flex",gap:14,marginTop:9,flexWrap:"wrap",fontSize:11,color:T.muted}} className="fmono"><span>R² {fmt(fit.r2,3)}</span><span>adj {fmt(fit.adj,3)}</span><span>n {fit.n}</span><span>{seLabel} SE</span>{catPreds.length>0&&<span>FE: {catPreds.join(", ")}</span>}{dropped>0&&<span style={{color:T.point}}>{dropped} rows dropped</span>}</div></div>
    <Reading caveat={"Standard errors: "+seLabel+". "+(dropped>0?dropped+" of "+dataset.rows.length+" rows dropped by listwise deletion. ":"")+"Coefficients are associations, not causal effects, absent a credible identification strategy — for that, see the IV or difference-in-differences blocks."+(fewClusters?" Few clusters (<20): cluster-robust SEs can be anti-conservative.":"")}>{elast||(single?<>A one-unit rise in <strong>{numPreds[0]}</strong> maps to {fit.beta[1]>=0?"+":""}{fmt(fit.beta[1],3)} in {y}. </>:<>Each coefficient is the partial association with {y}, holding the others fixed. </>)}Model captures <strong>{pct(fit.r2)}</strong> of {y}'s variation (n {fit.n}). {catPreds.length>0&&<>Category controls (fixed effects) for <strong>{catPreds.join(", ")}</strong> absorb level differences across groups; with panel data, cluster the SEs on the unit. </>}{smallN&&<strong style={{color:T.point}}>Small sample — tentative. </strong>}{hiVif&&<strong style={{color:T.point}}>VIF&gt;5: collinearity.</strong>}</Reading>
    {sorted&&<ChartBox title={y+" vs "+numPreds[0]+" with OLS fit"}><ResponsiveContainer width="100%" height={220}><ComposedChart data={sorted} margin={{top:8,right:14,bottom:24,left:6}}><CartesianGrid stroke={T.line} strokeDasharray="2 3"/><XAxis dataKey="x" type="number" domain={["auto","auto"]} tick={tk} label={{value:numPreds[0],position:"bottom",offset:6,fontSize:11,fill:T.muted}}/><YAxis tick={tk} width={46}/><Tooltip contentStyle={tipStyle} formatter={v=>fmt(v,2)}/><Scatter dataKey="y" fill={T.interval} fillOpacity={0.72}/><Line dataKey="fit" stroke={T.point} strokeWidth={2.2} dot={false}/></ComposedChart></ResponsiveContainer></ChartBox>}
    <ChartBox title="Residuals vs fitted — funnel or curve means a violated assumption"><ResponsiveContainer width="100%" height={160}><ScatterChart margin={{top:8,right:14,bottom:22,left:6}}><CartesianGrid stroke={T.line} strokeDasharray="2 3"/><XAxis dataKey="fitted" type="number" tick={tk} label={{value:"fitted",position:"bottom",offset:6,fontSize:11,fill:T.muted}}/><YAxis dataKey="resid" type="number" tick={tk} width={46}/><ReferenceLine y={0} stroke={T.point} strokeDasharray="4 4"/><Tooltip contentStyle={tipStyle} formatter={v=>fmt(v,2)}/><Scatter data={resid} dataKey="resid" fill={T.inkSoft} fillOpacity={0.7}/></ScatterChart></ResponsiveContainer></ChartBox></div>);
}
function RegHead({y,nums,cats,numPreds,catPreds,seType,seOpts,clusterBy,onConfig}){
  function tog(p){const cur=numPreds.includes(p)?numPreds.filter(q=>q!==p):[...numPreds,p];onConfig({preds:cur});}
  function togC(p){const cur=catPreds.includes(p)?catPreds.filter(q=>q!==p):[...catPreds,p];onConfig({cats:cur});}
  return (<><div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:12,alignItems:"flex-end"}}><Selector label="outcome (y)" value={y} onChange={c=>onConfig({y:c})} options={nums}/><Toggle label="std. errors" value={seType} onChange={s=>onConfig({se:s})} options={seOpts}/>{seType==="Cluster"&&cats.length>0&&<Selector label="cluster by" value={clusterBy||cats[0]} onChange={c=>onConfig({cluster:c})} options={cats}/>}</div>
    <div style={{marginBottom:10}}><div className="fmono" style={{fontSize:10.5,color:T.muted,marginBottom:7,letterSpacing:"0.05em"}}>NUMERIC PREDICTORS</div><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{nums.filter(c=>c!==y).map(c=>(<button key={c} onClick={()=>tog(c)} className="btn btn-sm fmono" style={{fontSize:12,background:numPreds.includes(c)?T.interval:"transparent",color:numPreds.includes(c)?"#fff":T.muted,border:numPreds.includes(c)?"none":"1px solid "+T.line}}>{c}</button>))}</div></div>
    {cats.length>0&&<div style={{marginBottom:14}}><div className="fmono" style={{fontSize:10.5,color:T.muted,marginBottom:7,letterSpacing:"0.05em"}}>FIXED-EFFECT CONTROLS (CATEGORICAL)</div><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{cats.map(c=>(<button key={c} onClick={()=>togC(c)} className="btn btn-sm fmono" style={{fontSize:12,background:catPreds.includes(c)?T.point:"transparent",color:catPreds.includes(c)?"#fff":T.muted,border:catPreds.includes(c)?"none":"1px solid "+T.line}}>{c}</button>))}</div></div>}</>);
}
function VizForecast({dataset,cols,config,onConfig}){
  const nums=cols.filter(c=>c.type==="numeric").map(c=>c.field);if(!nums.length)return <Note>Need a numeric column.</Note>;
  const col=guard(config.col,nums,nums.length-1);const H=config.H||8;
  const series=numericCol(dataset.rows,col);if(series.length<5)return (<div><FcHead col={col} nums={nums} H={H} onConfig={onConfig}/><Note>Need at least 5 observations.</Note></div>);
  const t=series.map((_,i)=>i+1),fit=ols(t.map(v=>[v]),series),n=series.length,tbar=(n+1)/2,Sxx=t.reduce((s,v)=>s+(v-tbar)**2,0),s=fit.sigma,tcrit=tInv(0.975,n-2);
  const dw=durbinWatson(fit.resid),nwSlopeSE=neweyWestSE(fit.X,fit.resid,fit.XtXinv)[1],clSlopeSE=fit.se[1],autocorr=Math.abs(dw-2)>0.6;
  const data=series.map((v,i)=>({t:i+1,actual:v,forecast:null,range:null}));
  for(let h=1;h<=H;h++){const t0=n+h,mean=fit.beta[0]+fit.beta[1]*t0,sePred=s*Math.sqrt(1+1/n+(t0-tbar)**2/Sxx);data.push({t:t0,actual:null,forecast:+mean.toFixed(2),range:[+(mean-tcrit*sePred).toFixed(2),+(mean+tcrit*sePred).toFixed(2)]});}
  const fc=data.filter(d=>d.forecast!==null),bt=backtest(series),beatsNaive=bt&&bt.mae<bt.naiveMae;
  return (<div><FcHead col={col} nums={nums} H={H} onConfig={onConfig}/>
    <ChartBox title={col+": observed → forecast (95% interval)"}><ResponsiveContainer width="100%" height={250}><ComposedChart data={data} margin={{top:8,right:14,bottom:22,left:6}}><CartesianGrid stroke={T.line} strokeDasharray="2 3"/><XAxis dataKey="t" tick={tk} label={{value:"period",position:"bottom",offset:6,fontSize:11,fill:T.muted}}/><YAxis tick={tk} width={46} domain={["auto","auto"]}/><Tooltip contentStyle={tipStyle} formatter={v=>Array.isArray(v)?"["+fmt(v[0],1)+", "+fmt(v[1],1)+"]":fmt(v,1)}/><Area dataKey="range" stroke="none" fill={T.interval} fillOpacity={0.16} isAnimationActive={false}/><ReferenceLine x={n} stroke={T.muted} strokeDasharray="2 4"/><Line dataKey="actual" stroke={T.ink} strokeWidth={2.2} dot={false} connectNulls={false}/><Line dataKey="forecast" stroke={T.point} strokeWidth={2.2} strokeDasharray="6 4" dot={false} connectNulls={false}/></ComposedChart></ResponsiveContainer></ChartBox>
    <div className="card" style={{padding:"10px 14px",marginBottom:10}} ><div style={{display:"flex",gap:16,flexWrap:"wrap",fontSize:11.5,color:T.muted}} className="fmono"><span>slope {fmt(fit.beta[1],3)}/step</span><span>SE (classical) {fmt(clSlopeSE,3)}</span><span style={{color:autocorr?T.point:T.muted}}>SE (Newey–West HAC) {fmt(nwSlopeSE,3)}</span><span style={{color:autocorr?T.point:T.muted}}>Durbin–Watson {fmt(dw,2)}</span></div></div>
    <Reading caveat={"A linear-trend baseline (not ARIMA): assumes a stable trend, no seasonality or breaks. The 95% bands assume i.i.d. normal errors. "+(autocorr?"Durbin–Watson is far from 2, so residuals are autocorrelated and the bands are too narrow — treat them as a lower bound on uncertainty; the HAC slope SE above is the more trustworthy one.":"Durbin–Watson is near 2, so serial correlation looks mild.")}>Trend is <strong>{fit.beta[1]>=0?"rising":"falling"}</strong> at {fmt(Math.abs(fit.beta[1]),2)}/step. Next step ≈ <strong>{fmt(fc[0].forecast,1)}</strong>, range [{fmt(fc[0].range[0],1)}, {fmt(fc[0].range[1],1)}]; by step {H}, [{fmt(fc[fc.length-1].range[0],1)}, {fmt(fc[fc.length-1].range[1],1)}]. {autocorr&&<strong style={{color:T.point}}>Residuals are autocorrelated (DW {fmt(dw,2)}) — the intervals understate true uncertainty.</strong>}</Reading>
    {bt&&<><ChartBox title="Backtest — one-step-ahead out-of-sample vs actual"><ResponsiveContainer width="100%" height={170}><LineChart data={bt.recs} margin={{top:8,right:14,bottom:22,left:6}}><CartesianGrid stroke={T.line} strokeDasharray="2 3"/><XAxis dataKey="t" tick={tk}/><YAxis tick={tk} width={46} domain={["auto","auto"]}/><Tooltip contentStyle={tipStyle} formatter={v=>fmt(v,2)}/><Line dataKey="actual" stroke={T.ink} strokeWidth={2.2} dot={false}/><Line dataKey="pred" stroke={T.point} strokeWidth={2} strokeDasharray="5 4" dot={false}/></LineChart></ResponsiveContainer></ChartBox>
    <Reading caveat="A backtest validates the procedure, not the future.">Over <strong>{bt.k}</strong> out-of-sample forecasts, MAE <strong>{fmt(bt.mae,2)}</strong> (RMSE {fmt(bt.rmse,2)}). Naive baseline MAE {fmt(bt.naiveMae,2)} — the trend model <strong style={{color:beatsNaive?T.interval:T.point}}>{beatsNaive?"beats":"does not beat"}</strong> guessing the last value.</Reading></>}</div>);
}
function FcHead({col,nums,H,onConfig}){
  return (<div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:14,alignItems:"flex-end"}}><Selector label="series" value={col} onChange={c=>onConfig({col:c})} options={nums}/><div><div className="fmono" style={{fontSize:10.5,color:T.muted,marginBottom:5,letterSpacing:"0.05em"}}>HORIZON: {H}</div><input type="range" min={2} max={16} value={H} onChange={e=>onConfig({H:+e.target.value})} style={{width:130,accentColor:T.interval}}/></div></div>);
}

function FanChart(){
  const W=560,H=360,padL=8,padR=8,padT=18,padB=22;
  const data=useMemo(()=>{const rng=mulberry32(21);const hist=[];let v=42;for(let t=0;t<26;t++){v+=0.62+(rng()-0.5)*2.4;hist.push(v);}const last=hist[hist.length-1],slope=0.62,fc=[],lo=[],hi=[];for(let h=1;h<=20;h++){const mean=last+slope*h,spread=2.0*Math.sqrt(h);fc.push(mean);lo.push(mean-1.96*spread);hi.push(mean+1.96*spread);}return {hist,fc,lo,hi};},[]);
  const all=[...data.hist,...data.fc,...data.lo,...data.hi],ymin=Math.min(...all)-2,ymax=Math.max(...all)+2,total=data.hist.length+data.fc.length;
  const X=i=>padL+(i/(total-1))*(W-padL-padR),Y=v=>padT+(1-(v-ymin)/(ymax-ymin))*(H-padT-padB);
  const histPts=data.hist.map((v,i)=>X(i)+","+Y(v)).join(" "),s=data.hist.length-1;
  const fcPts=[X(s)+","+Y(data.hist[s]),...data.fc.map((v,i)=>X(s+1+i)+","+Y(v))].join(" ");
  const bandUp=[X(s)+","+Y(data.hist[s]),...data.hi.map((v,i)=>X(s+1+i)+","+Y(v))];
  const bandLo=[...data.lo.map((v,i)=>X(s+1+i)+","+Y(v)).reverse(),X(s)+","+Y(data.hist[s])];
  const bandPath="M "+[...bandUp,...bandLo].join(" L ")+" Z";
  return (<svg viewBox={"0 0 "+W+" "+H} width="100%" style={{display:"block"}} role="img" aria-label="Forecast fan chart with widening prediction interval.">
    <defs><clipPath id="reveal"><rect x="0" y="0" height={H} width="0"><animate attributeName="width" dur="2.4s" begin="0.2s" fill="freeze" calcMode="spline" keySplines="0.2 0.7 0.2 1" keyTimes="0;1" values={"0;"+W}/></rect></clipPath><linearGradient id="bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={T.interval} stopOpacity="0.05"/><stop offset="100%" stopColor={T.interval} stopOpacity="0.22"/></linearGradient></defs>
    {[0,0.25,0.5,0.75,1].map((g,i)=>(<line key={i} x1={padL} x2={W-padR} y1={padT+g*(H-padT-padB)} y2={padT+g*(H-padT-padB)} stroke={T.line} strokeWidth="1"/>))}
    <g clipPath="url(#reveal)"><path d={bandPath} fill="url(#bg)"/><polyline points={bandUp.join(" ")} fill="none" stroke={T.interval} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 3"/><polyline points={bandLo.join(" ")} fill="none" stroke={T.interval} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 3"/><polyline points={histPts} fill="none" stroke={T.ink} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round"/><polyline points={fcPts} fill="none" stroke={T.point} strokeWidth="2.4" strokeDasharray="6 4" strokeLinecap="round"/><circle cx={X(s)} cy={Y(data.hist[s])} r="3.5" fill={T.ink}/><circle cx={X(total-1)} cy={Y(data.fc[data.fc.length-1])} r="4" fill={T.point}/></g>
    <line x1={X(s)} x2={X(s)} y1={padT} y2={H-padB} stroke={T.muted} strokeWidth="1" strokeDasharray="2 4" opacity="0.6"/><text x={X(s)+5} y={padT+12} className="fmono" fontSize="9" fill={T.muted}>now</text></svg>);
}
function Wordmark({small,light}){return (<div style={{display:"flex",alignItems:"baseline",gap:8}}><span className="fdisplay" style={{fontSize:small?19:22,fontWeight:600,letterSpacing:"-0.02em",color:light?T.paper:T.ink}}>Candor</span>{!small&&<span className="fmono" style={{fontSize:10,color:T.muted,letterSpacing:"0.18em"}}>WORKSPACE</span>}</div>);}
function Legend({color,label,dash,band}){return (<div style={{display:"flex",alignItems:"center",gap:7}}>{band?<span style={{width:18,height:11,background:color,opacity:0.22,borderRadius:2,border:"1px dashed "+color}}/>:<span style={{width:18,height:0,borderTop:"2.4px "+(dash?"dashed":"solid")+" "+color}}/>}<span className="fmono" style={{fontSize:11,color:T.muted}}>{label}</span></div>);}
function Landing({onLaunch}){
  const pillars=[{icon:LayoutTemplate,name:"Start from a template",desc:"Pick a document type — exploratory, correlation, regression, or forecast — and Candor sets up the right starting blocks."},{icon:Search,name:"Search any visualizer",desc:"Type what you want to see — scatter, histogram, correlation matrix, forecast — and drop it into your document as a block."},{icon:GraduationCap,name:"Ask the Teacher",desc:"A built-in AI assistant reads your data and the results of every block, interprets them, and explains any concept — at a depth you dial from Beginner to Advanced."}];
  const trust=["Runs entirely in your browser","Statistics computed locally, not by AI","Numbers you can audit, line by line","An AI Teacher that explains, never fabricates"];
  return (<div>
    <nav className="candor" style={{position:"sticky",top:0,zIndex:30,background:"rgba(237,240,242,0.82)",backdropFilter:"blur(8px)",borderBottom:"1px solid "+T.line}}><div style={{maxWidth:1120,margin:"0 auto",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}><Wordmark/><button className="btn btn-primary btn-sm" onClick={onLaunch}>Open the workspace<ArrowRight size={15}/></button></div></nav>
    <header style={{maxWidth:1120,margin:"0 auto",padding:"0 24px"}}><div style={{display:"grid",gridTemplateColumns:"1fr",gap:40,alignItems:"center",paddingTop:60,paddingBottom:34}} className="hero-grid">
      <div className="fade"><div className="eyebrow" style={{marginBottom:18}}>A document, not a dashboard</div><h1 className="fdisplay" style={{fontSize:"clamp(36px,6vw,64px)",lineHeight:1.03,fontWeight:600,margin:"0 0 20px"}}>Build a data document.<br/><span style={{color:T.interval}}>Understand every chart in it.</span></h1>
        <p style={{fontSize:18,color:T.inkSoft,maxWidth:540,margin:"0 0 28px",lineHeight:1.55}}>Built for economic and social-science research: choose a template, upload your data, then search a library of charts and analyses — OLS with cluster-robust standard errors, instrumental variables and difference-in-differences, stationarity tests, backtested forecasts — and drop them into your document, each explained by a Teacher you can set from <span style={{color:T.point,fontWeight:600}}>simple</span> to <span style={{color:T.interval,fontWeight:600}}>rigorous</span>.</p>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}><button className="btn btn-primary" onClick={onLaunch}>Create a document<ArrowRight size={16}/></button><a className="btn btn-ghost" href="#how">How it works</a></div></div>
      <div className="card fade" style={{padding:"18px 18px 10px",animationDelay:".15s"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6,padding:"0 4px"}}><span className="fmono" style={{fontSize:11,color:T.muted,letterSpacing:"0.05em"}}>FORECAST · indicator</span><span className="fmono" style={{fontSize:11,color:T.muted}}>95% interval</span></div><FanChart/><div style={{display:"flex",gap:18,padding:"4px 6px 8px",flexWrap:"wrap"}}><Legend color={T.ink} label="observed"/><Legend color={T.point} label="point forecast" dash/><Legend color={T.interval} label="prediction interval" band/></div></div>
    </div>
    <div style={{display:"flex",gap:"10px 26px",flexWrap:"wrap",justifyContent:"center",paddingBottom:46}}>{trust.map((t,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:7}}><Check size={15} style={{color:T.interval}}/><span style={{fontSize:13.5,color:T.inkSoft}}>{t}</span></div>))}</div></header>
    <section id="how" style={{background:T.surface,borderTop:"1px solid "+T.line,borderBottom:"1px solid "+T.line}}><div style={{maxWidth:1120,margin:"0 auto",padding:"58px 24px"}}><div className="eyebrow" style={{marginBottom:10}}>How it works</div><h2 className="fdisplay" style={{fontSize:"clamp(26px,3.6vw,38px)",fontWeight:600,margin:"0 0 36px",maxWidth:640}}>Template → data → search → understand.</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:18}}>{pillars.map((m,i)=>(<div key={i} className="card lift" style={{padding:"26px 24px"}}><div style={{width:42,height:42,borderRadius:3,background:T.paper,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18,color:T.interval}}><m.icon size={21}/></div><h3 className="fdisplay" style={{fontSize:21,fontWeight:600,margin:"0 0 10px"}}>{m.name}</h3><p style={{fontSize:14.5,color:T.muted,lineHeight:1.58,margin:0}}>{m.desc}</p></div>))}</div></div></section>
    <section style={{background:T.ink,color:T.paper}}><div style={{maxWidth:1120,margin:"0 auto",padding:"66px 24px"}}><div className="eyebrow" style={{marginBottom:24,color:T.pointSoft}}>The rules of truth</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"34px 48px"}}>{[["Correlation is not cause.","Relationships are labelled associations, and many correlations at once get a false-discovery correction."],["Significance is not importance.","Robust standard errors and VIF checks come standard; effect size is weighed with significance."],["Nothing is fabricated.","Numbers come only from your file — every statistic computed in front of you, exportable to a report."],["Uncertainty is surfaced.","Forecasts are backtested against a naive baseline. If the model can't beat 'no change', it says so."]].map((it,i)=>(<div key={i}><h3 className="fdisplay" style={{fontSize:23,fontWeight:600,margin:"0 0 10px",lineHeight:1.18}}>{it[0]}</h3><p style={{fontSize:15,color:"#B9C2CB",lineHeight:1.6,margin:0}}>{it[1]}</p></div>))}</div></div></section>
    <section><div style={{maxWidth:1120,margin:"0 auto",padding:"72px 24px",textAlign:"center"}}><h2 className="fdisplay" style={{fontSize:"clamp(30px,4.6vw,52px)",fontWeight:600,margin:"0 0 18px",lineHeight:1.08}}>Not smarter outputs. Clearer thinking.</h2><p style={{fontSize:17,color:T.muted,maxWidth:520,margin:"0 auto 30px"}}>Pick a template and build a document you can actually defend.</p><button className="btn btn-primary" onClick={onLaunch} style={{fontSize:16,padding:"15px 28px"}}>Create a document<ArrowRight size={17}/></button></div></section>
    <footer style={{borderTop:"1px solid "+T.line}}><div style={{maxWidth:1120,margin:"0 auto",padding:"26px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}><Wordmark small/><span className="fmono" style={{fontSize:11.5,color:T.muted}}>Clear · local · candid about uncertainty</span></div></footer>
  </div>);
}

function VizStationarity({dataset,cols,config,onConfig}){
  const nums=cols.filter(c=>c.type==="numeric").map(c=>c.field);if(!nums.length)return <Note>Need a numeric column.</Note>;
  const col=guard(config.col,nums,nums.length-1);const spec=guard(config.spec,["Constant","Constant + trend"]);const trend=spec==="Constant + trend"?"ct":"c";
  const series=numericCol(dataset.rows,col);const res=adf(series,{trend});const kp=series.length>10?kpss(series,trend):null;
  // ADF: reject ⇒ stationary. KPSS: reject (stat>cv) ⇒ NON-stationary. They agree when ADF rejects AND KPSS does not.
  let verdict="inconclusive",vcolor=T.point;
  if(res){const adfStat=res.reject5,kpssStat=kp?!kp.nonstat5:true;if(adfStat&&kpssStat){verdict="stationary";vcolor=T.interval;}else if(!adfStat&&!kpssStat){verdict="non-stationary (likely unit root)";vcolor=T.point;}else{verdict="ambiguous — the two tests disagree";vcolor=T.point;}}
  return (<div><div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:12,alignItems:"flex-end"}}><Selector label="series (row order)" value={col} onChange={c=>onConfig({col:c})} options={nums}/><Toggle label="specification" value={spec} onChange={s=>onConfig({spec:s})} options={["Constant","Constant + trend"]}/></div>
    {!res?<Note>Need a longer series to run the test.</Note>:(<>
      <div className="card" style={{padding:"14px 16px",marginBottom:10,overflowX:"auto"}}><table style={{borderCollapse:"collapse",fontFamily:"IBM Plex Mono",fontSize:12.5,minWidth:340}}><tbody>
        <tr><td style={{...td,color:T.muted}}>ADF statistic <span style={{opacity:.7}}>(H₀: unit root)</span></td><td style={{...td,fontWeight:600,color:res.reject5?T.interval:T.point}}>{fmt(res.tstat,3)}</td><td style={{...td,color:T.muted}}>crit 5% {fmt(res.cv.p5,2)} · {res.reject5?"reject ⇒ stationary":"fail to reject"}</td></tr>
        {kp&&<tr><td style={{...td,color:T.muted}}>KPSS statistic <span style={{opacity:.7}}>(H₀: stationary)</span></td><td style={{...td,fontWeight:600,color:kp.nonstat5?T.point:T.interval}}>{fmt(kp.stat,3)}</td><td style={{...td,color:T.muted}}>crit 5% {fmt(kp.cv.p5,2)} · {kp.nonstat5?"reject ⇒ non-stationary":"fail to reject"}</td></tr>}
        <tr><td style={{...td,color:T.muted}}>spec / lags / obs</td><td style={td} colSpan={2}>{trend==="ct"?"constant + trend":"constant"} / {res.lags} / {res.n}</td></tr>
      </tbody></table></div>
      <Reading caveat="ADF and KPSS have opposite null hypotheses, so they cross-check each other. Critical values are asymptotic. A non-stationary series produces spurious regressions and unreliable forecasts — difference it (the Δ transform) or use growth rates first.">Taken together the series <strong style={{color:vcolor}}>{verdict==="stationary"?"appears stationary":verdict==="non-stationary (likely unit root)"?"appears non-stationary — a likely unit root":"is "+verdict}</strong>. {verdict!=="stationary"&&"Difference it or take growth rates before regression or forecasting."} {trend==="c"&&res&&!res.reject5&&"If the series clearly trends, try the constant + trend specification."}</Reading>
    </>)}</div>);
}
function ChipRow({label,options,selected,onToggle,color}){
  return (<div style={{marginBottom:10}}><div className="fmono" style={{fontSize:10.5,color:T.muted,marginBottom:7,letterSpacing:"0.05em"}}>{label}</div><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{options.length?options.map(c=>(<button key={c} onClick={()=>onToggle(c)} className="btn btn-sm fmono" style={{fontSize:12,background:selected.includes(c)?(color||T.interval):"transparent",color:selected.includes(c)?"#fff":T.muted,border:selected.includes(c)?"none":"1px solid "+T.line}}>{c}</button>)):<span style={{fontSize:12,color:T.muted}}>—</span>}</div></div>);
}
function VizIV({dataset,cols,config,onConfig}){
  const nums=cols.filter(c=>c.type==="numeric").map(c=>c.field),catsAll=cols.filter(c=>c.type==="categorical").map(c=>c.field);
  if(nums.length<2)return <Note>Instrumental-variables (2SLS) needs at least an outcome, an endogenous regressor, and one instrument — i.e. several numeric columns.</Note>;
  const y=guard(config.y,nums,0);
  const endogOpts=nums.filter(c=>c!==y);const endog=guard(config.endog,endogOpts);
  const instrOpts=nums.filter(c=>c!==y&&c!==endog);
  const instruments=(config.instruments||[]).filter(c=>instrOpts.includes(c));
  const controlOpts=nums.filter(c=>c!==y&&c!==endog&&!instruments.includes(c));
  const controls=(config.controls||[]).filter(c=>controlOpts.includes(c));
  const seType=guard(config.se,["Classical","HC1","Cluster"],1);
  const clusterBy=seType==="Cluster"?(config.cluster&&catsAll.includes(config.cluster)?config.cluster:catsAll[0]||null):null;
  const head=(<div><div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:12,alignItems:"flex-end"}}><Selector label="outcome (y)" value={y} onChange={c=>onConfig({y:c})} options={nums}/><Selector label="endogenous regressor" value={endog} onChange={c=>onConfig({endog:c})} options={endogOpts}/><Toggle label="std. errors" value={seType} onChange={s=>onConfig({se:s})} options={["Classical","HC1","Cluster"]}/>{seType==="Cluster"&&catsAll.length>0&&<Selector label="cluster by" value={clusterBy||catsAll[0]} onChange={c=>onConfig({cluster:c})} options={catsAll}/>}</div>
    <ChipRow label="INSTRUMENTS (EXCLUDED)" options={instrOpts} selected={instruments} onToggle={c=>onConfig({instruments:instruments.includes(c)?instruments.filter(q=>q!==c):[...instruments,c]})}/>
    <ChipRow label="EXOGENOUS CONTROLS (OPTIONAL)" options={controlOpts} selected={controls} color={T.point} onToggle={c=>onConfig({controls:controls.includes(c)?controls.filter(q=>q!==c):[...controls,c]})}/></div>);
  if(!instruments.length)return <div>{head}<Note>Pick at least one instrument. A valid instrument must (1) predict the endogenous regressor and (2) affect the outcome only through it (the exclusion restriction — which is an assumption, not testable here).</Note></div>;
  const Y=[],EX=[],EN=[],ZZ=[],CID=[];
  for(const r of dataset.rows){const yv=Number(r[y]),ev=Number(r[endog]);if(!isFinite(yv)||!isFinite(ev))continue;const zs=instruments.map(z=>Number(r[z]));if(!zs.every(isFinite))continue;const xs=controls.map(c=>Number(r[c]));if(!xs.every(isFinite))continue;let cid=null;if(clusterBy){cid=String(r[clusterBy]==null?"":r[clusterBy]);if(cid==="")continue;}Y.push(yv);EX.push(xs);EN.push([ev]);ZZ.push(zs);CID.push(cid);}
  const dropped=dataset.rows.length-Y.length;
  if(Y.length<controls.length+instruments.length+3)return <div>{head}<Note>Not enough complete rows for this specification.</Note></div>;
  let res;try{res=tsls(Y,EX,EN,ZZ,{type:seType==="Cluster"&&clusterBy?"cluster":seType==="HC1"?"HC1":seType==="Cluster"?"HC1":"classical",clusterIds:clusterBy?CID:null});}catch(e){return <div>{head}<Note>Could not estimate (instruments may be collinear): {e.message}</Note></div>;}
  const terms=["(intercept)",...controls,endog];
  const fF=res.firstF[0],weak=fF.F<10,overid=instruments.length>1;
  const seLabel=clusterBy?("cluster-robust ("+instruments.length+" instr.)"):seType==="HC1"||seType==="Cluster"?"HC1 robust":"classical";
  return (<div>{head}
    <div className="card" style={{padding:"12px 14px",marginBottom:10,overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontFamily:"IBM Plex Mono",fontSize:12,minWidth:360}}><thead><tr style={{color:T.muted}}>{["term","coef. (2SLS)","s.e.","t","p",""].map((h,i)=><th key={i} style={{...th,background:"none",borderBottom:"1px solid "+T.line}}>{h}</th>)}</tr></thead>
      <tbody>{terms.map((term,i)=>(<tr key={i} style={term===endog?{background:T.ribbon}:null}><td style={{...td,fontWeight:term===endog?600:400}}>{term}{term===endog?" ◂ instrumented":""}</td><td style={td}>{fmt(res.beta[i])}</td><td style={td}>{fmt(res.se[i])}</td><td style={td}>{fmt(res.t[i],2)}</td><td style={td}>{fmt(res.p[i],4)}</td><td style={{...td,color:T.point}}>{pStar(res.p[i])}</td></tr>))}</tbody></table>
      <div style={{display:"flex",gap:14,marginTop:9,flexWrap:"wrap",fontSize:11,color:T.muted}} className="fmono"><span>n {res.n}</span><span>{seLabel} SE</span><span style={{color:weak?T.point:T.interval}}>first-stage F {fmt(fF.F,1)}</span><span>{overid?"over-identified":"just-identified"}</span>{dropped>0&&<span style={{color:T.point}}>{dropped} dropped</span>}</div></div>
    <Reading caveat={"2SLS isolates the part of "+endog+" driven by the instruments. The exclusion restriction (instruments affect "+y+" only through "+endog+") is assumed, not tested. "+(weak?"Weak instruments (F<10): the 2SLS estimate is biased toward OLS and its SE is unreliable — find stronger instruments.":"First-stage F above the Stock–Yogo rule-of-thumb of 10.")}>The coefficient on <strong>{endog}</strong> is its estimated causal effect on {y}: a one-unit rise changes {y} by <strong>{res.beta[terms.indexOf(endog)]>=0?"+":""}{fmt(res.beta[terms.indexOf(endog)],3)}</strong> (p {fmt(res.p[terms.indexOf(endog)],3)}). First-stage F is <strong style={{color:weak?T.point:T.interval}}>{fmt(fF.F,1)}</strong>{weak?" — too weak to trust":" — instruments look relevant"}. {overid&&"With more instruments than endogenous regressors, the model is over-identified (you could test the over-identifying restrictions externally)."}</Reading></div>);
}
function toIndicator(rows,field){
  const raw=rows.map(r=>r[field]);
  const numericVals=raw.map(v=>typeof v==="number"?v:parseFloat(String(v).replace(/[, ]/g,"")));
  const binaryNum=numericVals.every(v=>isNaN(v)||v===0||v===1)&&numericVals.some(v=>v===1);
  if(binaryNum)return {fn:r=>{const v=typeof r[field]==="number"?r[field]:parseFloat(String(r[field]).replace(/[, ]/g,""));return isNaN(v)?null:(v>=1?1:0);},posLabel:field+"=1"};
  const uniq=[...new Set(raw.map(v=>String(v==null?"":v)).filter(s=>s!==""))].sort();
  const pos=uniq.find(l=>/post|treat|after|yes|true|^1$/i.test(l))||uniq[uniq.length-1];
  return {fn:r=>{const s=String(r[field]==null?"":r[field]);return s===""?null:(s===pos?1:0);},posLabel:field+'="'+pos+'"'};
}
function VizDiD({dataset,cols,config,onConfig}){
  const nums=cols.filter(c=>c.type==="numeric").map(c=>c.field);
  const indicatorOpts=cols.filter(c=>c.type==="categorical"||(c.stats&&c.stats.min>=0&&c.stats.max<=1)).map(c=>c.field);
  const allCols=cols.map(c=>c.field);
  if(!nums.length||allCols.length<3)return <Note>Difference-in-differences needs an outcome, a treated-group indicator, and a time (post) indicator.</Note>;
  const y=guard(config.y,nums,0);
  const idxOpts=indicatorOpts.length?indicatorOpts:allCols;
  const treat=guard(config.treat,idxOpts);
  const post=guard(config.post,idxOpts.filter(c=>c!==treat).length?idxOpts.filter(c=>c!==treat):idxOpts);
  const feOpts=["(none)",...cols.filter(c=>c.type==="categorical").map(c=>c.field)];
  const unitFE=guard(config.unitFE,feOpts)||"(none)";const timeFE=guard(config.timeFE,feOpts)||"(none)";
  const useUnit=unitFE&&unitFE!=="(none)"&&allCols.includes(unitFE);
  const useTime=timeFE&&timeFE!=="(none)"&&allCols.includes(timeFE);
  const seType=guard(config.se,["Classical","HC1","Cluster"],2);
  const clusterCandidates=[...new Set([...(useUnit?[unitFE]:[]),treat,...cols.filter(c=>c.type==="categorical").map(c=>c.field)])];
  const clusterBy=seType==="Cluster"?(config.cluster&&clusterCandidates.includes(config.cluster)?config.cluster:clusterCandidates[0]||null):null;
  const head=(<div><div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:12,alignItems:"flex-end"}}><Selector label="outcome (y)" value={y} onChange={c=>onConfig({y:c})} options={nums}/><Selector label="treated group" value={treat} onChange={c=>onConfig({treat:c})} options={idxOpts}/><Selector label="post period" value={post} onChange={c=>onConfig({post:c})} options={idxOpts}/></div>
    <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:12,alignItems:"flex-end"}}><Selector label="unit fixed effects" value={unitFE} onChange={c=>onConfig({unitFE:c})} options={feOpts}/><Selector label="time fixed effects" value={timeFE} onChange={c=>onConfig({timeFE:c})} options={feOpts}/><Toggle label="std. errors" value={seType} onChange={s=>onConfig({se:s})} options={["Classical","HC1","Cluster"]}/>{seType==="Cluster"&&clusterCandidates.length>0&&<Selector label="cluster by" value={clusterBy||clusterCandidates[0]} onChange={c=>onConfig({cluster:c})} options={clusterCandidates}/>}</div></div>);
  const tI=toIndicator(dataset.rows,treat),pI=toIndicator(dataset.rows,post);
  const recs=[];
  for(const r of dataset.rows){const yv=Number(r[y]);if(!isFinite(yv))continue;const tv=tI.fn(r),pv=pI.fn(r);if(tv==null||pv==null)continue;let u=null,tm=null;if(useUnit){u=String(r[unitFE]==null?"":r[unitFE]);if(u==="")continue;}if(useTime){tm=String(r[timeFE]==null?"":r[timeFE]);if(tm==="")continue;}let cid=null;if(clusterBy){cid=String(r[clusterBy]==null?"":r[clusterBy]);if(cid==="")continue;}recs.push({y:yv,treat:tv,post:pv,u,tm,cid});}
  const dropped=dataset.rows.length-recs.length;
  if(recs.length<6)return <div>{head}<Note>Not enough complete rows for this design.</Note></div>;
  const unitLevels=useUnit?[...new Set(recs.map(r=>r.u))].sort():[];
  const timeLevels=useTime?[...new Set(recs.map(r=>r.tm))].sort():[];
  const termNames=["treat×post"],isFE=[false];
  if(useUnit){unitLevels.slice(1).forEach(l=>{termNames.push(unitFE+"="+l);isFE.push(true);});}else{termNames.push("treated["+tI.posLabel+"]");isFE.push(false);}
  if(useTime){timeLevels.slice(1).forEach(l=>{termNames.push(timeFE+"="+l);isFE.push(true);});}else{termNames.push("post["+pI.posLabel+"]");isFE.push(false);}
  const X=recs.map(r=>{const row=[r.treat*r.post];if(useUnit){unitLevels.slice(1).forEach(l=>row.push(r.u===l?1:0));}else{row.push(r.treat);}if(useTime){timeLevels.slice(1).forEach(l=>row.push(r.tm===l?1:0));}else{row.push(r.post);}return row;});
  if(recs.length<termNames.length+2)return <div>{head}<Note>Too many fixed-effect levels for the number of rows — drop a fixed effect.</Note></div>;
  let fit;try{fit=regress(X,recs.map(r=>r.y),{type:seType==="Cluster"&&clusterBy?"cluster":seType==="HC1"?"HC1":seType==="Cluster"?"HC1":"classical",clusterIds:clusterBy?recs.map(r=>r.cid):null});}catch(e){return <div>{head}<Note>Could not estimate: {e.message}</Note></div>;}
  const did=fit.beta[1],didSE=fit.se[1],didP=fit.p[1];
  const terms=["(intercept)",...termNames];
  const showIdx=terms.map((t,i)=>i).filter(i=>i===0||!isFE[i-1]);
  const feCount=isFE.filter(Boolean).length;
  const seLabel=clusterBy?("cluster-robust ("+fit.G+" clusters of "+clusterBy+")"):seType==="HC1"||seType==="Cluster"?"HC1 robust":"classical";
  return (<div>{head}
    <div className="card" style={{padding:"14px 16px",marginBottom:10,borderLeft:"3px solid "+T.interval}}><div className="eyebrow" style={{marginBottom:6,fontSize:10}}>Difference-in-differences estimate (treat × post)</div><div style={{display:"flex",alignItems:"baseline",gap:12,flexWrap:"wrap"}}><span className="fdisplay" style={{fontSize:30,fontWeight:600,color:didP<0.05?T.interval:T.ink}}>{did>=0?"+":""}{fmt(did,3)}</span><span className="fmono" style={{fontSize:12,color:T.muted}}>s.e. {fmt(didSE,3)} · t {fmt(did/didSE,2)} · p {fmt(didP,4)} {pStar(didP)}</span></div></div>
    <div className="card" style={{padding:"12px 14px",marginBottom:10,overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontFamily:"IBM Plex Mono",fontSize:12,minWidth:340}}><thead><tr style={{color:T.muted}}>{["term","coef.","s.e.","t","p",""].map((h,i)=><th key={i} style={{...th,background:"none",borderBottom:"1px solid "+T.line}}>{h}</th>)}</tr></thead>
      <tbody>{showIdx.map(i=>(<tr key={i} style={i===1?{background:T.ribbon}:null}><td style={{...td,fontWeight:i===1?600:400}}>{terms[i]}</td><td style={td}>{fmt(fit.beta[i])}</td><td style={td}>{fmt(fit.se[i])}</td><td style={td}>{fmt(fit.t[i],2)}</td><td style={td}>{fmt(fit.p[i],4)}</td><td style={{...td,color:T.point}}>{pStar(fit.p[i])}</td></tr>))}</tbody></table>
      <div style={{display:"flex",gap:14,marginTop:9,flexWrap:"wrap",fontSize:11,color:T.muted}} className="fmono"><span>R² {fmt(fit.r2,3)}</span><span>n {fit.n}</span><span>{seLabel} SE</span>{feCount>0&&<span>+{feCount} FE dummies ({[useUnit?unitFE:null,useTime?timeFE:null].filter(Boolean).join(", ")})</span>}{dropped>0&&<span style={{color:T.point}}>{dropped} dropped</span>}</div></div>
    <Reading caveat={"This is a two-way-FE / 2×2 DiD. It identifies a causal effect only under PARALLEL TRENDS — that treated and control groups would have moved together absent treatment (untestable; check with a pre-trend/event-study plot). With staggered adoption and heterogeneous effects, two-way FE can be biased (Goodman-Bacon); Candor does not yet implement modern estimators (Callaway–Sant'Anna) for that case."}>The DiD estimate is <strong>{did>=0?"+":""}{fmt(did,3)}</strong>: the change in {y} for the treated group from pre to post, net of the same change in the control group{didP<0.05?", and it is statistically significant":" (not significant at 5%)"}. Treated indicator inferred as <strong>{tI.posLabel}</strong>, post as <strong>{pI.posLabel}</strong> — confirm these are right. {clusterBy?<>SEs clustered on <strong>{clusterBy}</strong> ({fit.G} clusters){fit.G<20&&", though few clusters make them anti-conservative"}.</>:<>Consider clustering SEs on the treated unit.</>}</Reading></div>);
}
const VISUALIZERS=[
  {id:"summary",name:"Data summary",cat:"Data",icon:TableIcon,kw:"descriptive statistics mean sd missing overview table summarize",concept:"descriptive",Comp:VizSummary},
  {id:"preview",name:"Data preview",cat:"Data",icon:TableIcon,kw:"rows raw table preview head first peek",concept:"descriptive",Comp:VizPreview},
  {id:"histogram",name:"Histogram / distribution",cat:"Distribution",icon:BarChart3,kw:"histogram distribution spread skew frequency density shape",concept:"distribution",Comp:VizHistogram},
  {id:"scatter",name:"Scatter plot",cat:"Relationship",icon:CircleDot,kw:"scatter xy points relationship correlation trend dots compare two",concept:"correlation",Comp:VizScatter},
  {id:"bar",name:"Bar chart by category",cat:"Comparison",icon:BarChart3,kw:"bar category group compare mean sum count column ranking",concept:"descriptive",Comp:VizBar},
  {id:"line",name:"Line chart",cat:"Trend",icon:Activity,kw:"line trend time series over time sequence",concept:"forecast",Comp:VizLine},
  {id:"correlation",name:"Correlation matrix",cat:"Relationship",icon:LayoutGrid,kw:"correlation matrix heatmap pearson spearman relationships fdr grid",concept:"correlation",Comp:VizCorrelation},
  {id:"regression",name:"Regression (OLS)",cat:"Model",icon:Sigma,kw:"regression ols model coefficient predictor robust vif linear fit explain cluster hc2 hc3 fixed effects panel",concept:"regression",Comp:VizRegression},
  {id:"iv",name:"Instrumental variables (2SLS)",cat:"Causal",icon:Link2,kw:"iv instrument instrumental variables 2sls two stage least squares endogenous exclusion weak first stage causal",concept:"iv",Comp:VizIV},
  {id:"did",name:"Difference-in-differences",cat:"Causal",icon:LayoutGrid,kw:"did difference in differences treatment effect parallel trends panel two way fixed effects causal policy natural experiment",concept:"did",Comp:VizDiD},
  {id:"forecast",name:"Forecast",cat:"Trend",icon:TrendingUp,kw:"forecast predict future trend projection interval backtest extrapolate durbin watson autocorrelation",concept:"forecast",Comp:VizForecast},
  {id:"stationarity",name:"Stationarity test (ADF, KPSS)",cat:"Time series",icon:Activity,kw:"stationarity adf augmented dickey fuller kpss unit root time series difference trend econ",concept:"stationarity",Comp:VizStationarity},
];
const VIZ=Object.fromEntries(VISUALIZERS.map(v=>[v.id,v]));
const TEMPLATES=[
  {id:"blank",name:"Blank document",desc:"Start empty and add visualizations yourself.",icon:FileText,blocks:[]},
  {id:"explore",name:"Exploratory analysis",desc:"A summary, a distribution, and a scatter to get oriented.",icon:Search,blocks:["summary","histogram","scatter"]},
  {id:"corr",name:"Correlation study",desc:"Summary plus a correlation matrix and a fitted scatter.",icon:LayoutGrid,blocks:["summary","correlation","scatter"]},
  {id:"reg",name:"Regression report",desc:"Summary and an OLS regression with diagnostics.",icon:Sigma,blocks:["summary","regression"]},
  {id:"fc",name:"Forecast report",desc:"A line chart and a forecast with a backtest.",icon:TrendingUp,blocks:["summary","line","forecast"]},
  {id:"econ",name:"Time-series diagnostics",desc:"Summary, trend, a stationarity (ADF) test, and a backtested forecast — the econ time-series workflow.",icon:Activity,blocks:["summary","line","stationarity","forecast"]},
  {id:"micro",name:"Cross-section & elasticities",desc:"Summary, correlation matrix, and a regression with fixed-effect controls. Log a variable to read elasticities.",icon:Sigma,blocks:["summary","correlation","regression"]},
  {id:"causal",name:"Causal inference",desc:"Summary, an OLS baseline, then 2SLS and difference-in-differences for identification — the applied-micro toolkit.",icon:Link2,blocks:["summary","regression","iv","did"]},
];
const KB=[
  {id:"descriptive",term:"Descriptive statistics",kw:"mean sd average spread summary describe",B:"Numbers that summarize your data: the typical value (mean), how spread out it is (standard deviation), and the smallest and largest values.",I:"The mean is the balance point of the data; the standard deviation is the typical distance of values from it. They describe the sample you have, not any wider population.",A:"Sample moments. They are unbiased estimates of population parameters only if the sample is representative; the mean is sensitive to outliers, the median is not.",watch:"They describe only the rows you collected — a biased sample stays biased no matter how clean the arithmetic."},
  {id:"distribution",term:"Distribution & skew",kw:"histogram skew shape tail spread normal",B:"The shape of your data — whether values cluster in the middle or lean to one side (skew).",I:"Skew measures asymmetry: a long right tail (positive skew) pulls the mean above the median. Bin width changes how a histogram looks.",A:"Higher moments matter: with |skew| > 1, mean-based summaries and OLS assumptions weaken; consider a log transform or robust/median summaries.",watch:"A histogram's story can change with bin width — don't over-read one binning."},
  {id:"correlation",term:"Correlation",kw:"correlation r pearson spearman relationship together",B:"How strongly two things move together, from -1 to +1. Near +1 they rise together; near -1 one rises as the other falls.",I:"Pearson's r is standardized covariance and assumes a roughly linear link; Spearman uses ranks and captures any consistent (monotonic) relationship.",A:"r is the cosine of the angle between mean-centered vectors. Sensitive to outliers and non-linearity; a near-zero r can still hide a strong curved relationship.",watch:"Correlation never implies causation, and a lurking third variable can manufacture or mask it."},
  {id:"pvalue",term:"p-value",kw:"p value significance significant chance null",B:"The chance of seeing a result this strong if there were really nothing going on. Small means 'probably not just luck'.",I:"It's the probability of data at least this extreme under the null hypothesis. p < 0.05 means distinguishable from zero — not proof, and not a measure of effect size.",A:"P(data this extreme | null true). It says nothing about P(null) or about magnitude; with many tests, small p-values appear by chance — correct for it.",watch:"Statistical significance is not practical importance, and p < 0.05 is a convention, not a verdict."},
  {id:"regression",term:"Regression coefficient",kw:"regression coefficient beta ols slope holding constant predictor",B:"How much the outcome changes when you increase one input by one unit, keeping the others the same.",I:"OLS fits the line minimizing squared errors. Each coefficient is the partial association of a predictor with the outcome, holding the others fixed.",A:"β = (X'X)⁻¹X'y. 'Holding constant' is statistical, not experimental — omitted confounders bias the estimate; it is association, not effect, without identification.",watch:"A coefficient looks causal but isn't — a left-out confounder can fake or hide an effect."},
  {id:"iv",term:"Instrumental variables (2SLS)",kw:"iv instrument 2sls two stage endogenous exclusion weak first stage causal",B:"A way to estimate a cause when the thing you care about is tangled up with other influences, by using an outside 'nudge' that only affects the outcome through that thing.",I:"When a regressor is correlated with the error (endogenous), OLS is biased. An instrument predicts the regressor but is otherwise unrelated to the outcome; 2SLS uses only that predicted variation. Check the first-stage F.",A:"β_IV=(Ẑ'X)⁻¹Ẑ'y where Ẑ is the projection on instruments. Needs relevance (cov(Z,X)≠0, first-stage F≳10 by Stock–Yogo) and exclusion (cov(Z,u)=0, untestable). Weak instruments bias toward OLS and distort inference.",watch:"A weak instrument (low first-stage F) is worse than none — it gives precise-looking but badly biased estimates."},
  {id:"did",term:"Difference-in-differences",kw:"did difference in differences parallel trends treatment policy two way fixed effects causal",B:"Compare how a treated group changed before vs after against how an untreated group changed over the same period — the extra change is the effect.",I:"DiD nets out fixed group differences and common time shocks. The estimate is the coefficient on treated×post. It's causal only if the groups would have moved in parallel without treatment.",A:"Y_it=α+β·treat+γ·post+δ·(treat×post)+ε; δ is the ATT under parallel trends. Two-way FE generalizes it, but with staggered timing and heterogeneous effects TWFE is a biased weighted average (Goodman-Bacon) — use Callaway–Sant'Anna.",watch:"Parallel trends is the whole ballgame and can't be proven — check pre-treatment trends with an event study."},
  {id:"rsquared",term:"R-squared",kw:"r squared r2 fit variance explained goodness",B:"How much of the ups and downs in the outcome the model accounts for — 0 means none, 1 means all.",I:"The share of the outcome's variance explained by the model. High R² doesn't mean the model is correct or causal — just that it tracks the data.",A:"1 − SSE/SST. Mechanically rises with more predictors (use adjusted R²); high R² can coexist with biased coefficients and bad out-of-sample error.",watch:"A high R² can come from overfitting or from a spurious trend — it is not evidence of truth."},
  {id:"robustse",term:"Robust standard errors",kw:"robust hc1 heteroskedasticity standard error variance",B:"A safer way to measure how uncertain each estimate is when the data is messier in some places than others.",I:"Classical SEs assume equal error variance everywhere. Robust (HC1) SEs relax that, giving more trustworthy t-stats when residuals fan out.",A:"The HC1 sandwich estimator (X'X)⁻¹(X'diag(eᵢ²)X)(X'X)⁻¹·n/(n−k) is consistent under heteroskedasticity of unknown form.",watch:"If the residuals-vs-fitted plot funnels, classical SEs understate uncertainty — use robust."},
  {id:"vif",term:"Multicollinearity (VIF)",kw:"vif multicollinearity collinear correlated predictors inflate",B:"A warning that two predictors carry nearly the same information, making their separate effects hard to trust.",I:"The variance inflation factor shows how much a predictor's variance is inflated by overlap with others. Above ~5 is a concern.",A:"VIFⱼ = 1/(1−Rⱼ²) from regressing predictor j on the rest. High VIF inflates SEs and destabilizes coefficients without biasing them.",watch:"Tangled predictors give unstable coefficients — dropping or combining them often helps."},
  {id:"fdr",term:"Multiple testing (FDR)",kw:"fdr benjamini hochberg multiple testing correction false discovery",B:"When you test many things at once, some will look significant by pure luck. This correction guards against that.",I:"Benjamini–Hochberg controls the false-discovery rate — the expected share of 'significant' findings that are actually false.",A:"BH rejects up to the largest k with p(k) ≤ (k/m)α, controlling FDR at α under independence/PRDS — less conservative than Bonferroni.",watch:"'The strongest pair' out of many is partly luck — trust pairs that survive correction."},
  {id:"interval",term:"Prediction interval",kw:"prediction interval uncertainty band confidence forecast range",B:"The range a future value will probably fall in — the honest answer, since a single forecast number is almost always a bit wrong.",I:"It accounts for both model uncertainty and irreducible noise, so it's wider than a confidence interval and grows with the horizon.",A:"ŷ ± t·s·√(1 + 1/n + (x₀−x̄)²/Sₓₓ) under the OLS-normal model; it ignores model misspecification, so real coverage is often worse than nominal.",watch:"The band assumes the model is right — if the trend breaks, true coverage is worse than 95%."},
  {id:"backtest",term:"Backtesting",kw:"backtest out of sample rolling origin validation naive baseline",B:"Testing a forecast on past data it didn't get to see, to check whether it actually works.",I:"Rolling-origin backtesting re-fits on history and forecasts forward repeatedly, measuring real out-of-sample error against a naive baseline.",A:"Time-ordered cross-validation with no look-ahead leakage; comparison to a random-walk (last-value) baseline is the minimal bar for skill.",watch:"A backtest validates the procedure, not the future — regimes change."},
  {id:"forecast",term:"Forecasting",kw:"forecast predict trend extrapolate future projection",B:"Extending a trend into the future, with a band showing how unsure we are.",I:"A linear-trend forecast assumes the recent slope continues. The interval widens with horizon because errors compound.",A:"Trend extrapolation is the simplest model; it ignores seasonality, breaks, and mean-reversion — fine as a baseline, weak for turning points.",watch:"The further past your data you go, the more the confident-looking line outruns what the data supports."},
  {id:"stationarity",term:"Stationarity & unit roots",kw:"stationary unit root adf dickey fuller difference trend spurious",B:"A series is 'stationary' if its behaviour doesn't drift over time. Many economic series aren't — they trend or wander.",I:"Non-stationary (unit-root) series can show strong but spurious correlations. The ADF test checks for a unit root; differencing or growth rates usually fixes it.",A:"Under a unit root, OLS t-stats diverge and regressions are spurious (Granger–Newbold). ADF tests H₀: γ=0 in Δyₜ=α+γyₜ₋₁+ΣδᵢΔyₜ₋ᵢ; reject ⇒ stationary.",watch:"Regressing one trending series on another often gives a high R² that means nothing — difference first."},
  {id:"elasticity",term:"Elasticities (log-log)",kw:"elasticity log percent semi elasticity economics",B:"How much one thing changes in percent when another rises by one percent — a unit-free measure economists rely on.",I:"In a log–log regression the slope is an elasticity: a 1% rise in x is linked to β% change in y. If only y is logged, β is a semi-elasticity (≈100·β% per unit of x).",A:"d ln y / d ln x = β; a constant-elasticity (Cobb–Douglas) form. Interpretation stays associational unless x is exogenous.",watch:"An elasticity is still a regression slope — log scaling doesn't make it causal."},
  {id:"fixedeffects",term:"Fixed effects (controls)",kw:"fixed effects dummy category control entity time panel within",B:"Adding a category as a control lets each group have its own baseline, so you compare within groups instead of across them.",I:"Categorical controls become dummy variables (one per level minus a reference). They absorb fixed differences between groups — entities, regions, years.",A:"Equivalent to de-meaning within group; removes time-invariant confounders but not time-varying ones, and the dummies themselves aren't 'effects'.",watch:"Fixed effects control for what's constant within a group — not for confounders that change over time."},
];
const KBI=Object.fromEntries(KB.map(k=>[k.id,k]));

// ---- AI Teacher: build a faithful digest of the data + computed results, then call the model ----
function colDigest(cols){
  return cols.map(c=>c.stats
    ? `${c.field} (numeric): mean ${fmt(c.stats.mean,3)}, sd ${fmt(c.stats.sd,3)}, min ${fmt(c.stats.min,3)}, max ${fmt(c.stats.max,3)}, skew ${fmt(c.stats.skew,2)}, missing ${c.missing}/${c.total}`
    : `${c.field} (categorical): ${c.missing}/${c.total} missing`);
}
function blockResult(b,dataset,cols){
  const nums=cols.filter(c=>c.type==="numeric").map(c=>c.field);
  const cats=cols.filter(c=>c.type==="categorical").map(c=>c.field);
  const cfg=b.config||{};
  try{
    switch(b.vizId){
      case "summary":{
        const skew=cols.filter(c=>c.stats&&Math.abs(c.stats.skew)>1).map(c=>c.field);
        const miss=cols.filter(c=>c.missing/c.total>0.1).map(c=>c.field);
        return `Descriptive statistics for all columns (see column list above). ${miss.length?`Heavy missingness in ${miss.join(", ")}.`:"No column exceeds 10% missing."} ${skew.length?`Skewed (|skew|>1): ${skew.join(", ")}.`:"No column is strongly skewed."}`;
      }
      case "preview": return "Shows the first 10 raw rows of the dataset.";
      case "histogram":{
        if(!nums.length) return "No numeric column available.";
        const x=guard(cfg.x,nums),v=numericCol(dataset.rows,x);
        const m=v.reduce((a,b)=>a+b,0)/v.length,sd=Math.sqrt(v.reduce((s,k)=>s+(k-m)**2,0)/(v.length-1));
        const sk=sd>0?v.reduce((s,k)=>s+((k-m)/sd)**3,0)/v.length:0;
        return `Distribution of ${x}: mean ${fmt(m,2)}, sd ${fmt(sd,2)}, skew ${fmt(sk,2)} (${Math.abs(sk)<0.5?"roughly symmetric":sk>0?"right-skewed":"left-skewed"}), n=${v.length}.`;
      }
      case "scatter":{
        if(nums.length<2) return "Needs two numeric columns.";
        const x=guard(cfg.x,nums,0),y=guard(cfg.y,nums,1);
        const pts=dataset.rows.map(r=>({x:Number(r[x]),y:Number(r[y])})).filter(d=>isFinite(d.x)&&isFinite(d.y));
        const pr=pearson(pts.map(p=>p.x),pts.map(p=>p.y));
        let extra="";
        if(cfg.fit==="on"&&pts.length>2){const f=ols(pts.map(p=>[p.x]),pts.map(p=>p.y));extra=` Fitted line: each +1 in ${x} maps to ${f.beta[1]>=0?"+":""}${fmt(f.beta[1],3)} in ${y}, R²=${fmt(f.r2,3)}.`;}
        return `${y} vs ${x}: Pearson r=${fmt(pr.r,3)} (${strengthWord(pr.r)} ${pr.r>=0?"positive":"negative"}), n=${pr.n}.${extra}`;
      }
      case "bar":{
        if(!cats.length||!nums.length) return "Needs one categorical and one numeric column.";
        const cat=guard(cfg.cat,cats),y=guard(cfg.y,nums),agg=guard(cfg.agg,["mean","sum","count"]);
        const g=new Map();dataset.rows.forEach(r=>{const k=String(r[cat]==null?"—":r[cat]),val=Number(r[y]);if(!isFinite(val))return;if(!g.has(k))g.set(k,[]);g.get(k).push(val);});
        let arr=[...g.entries()].map(e=>({cat:e[0],value:agg==="mean"?e[1].reduce((a,b)=>a+b,0)/e[1].length:agg==="sum"?e[1].reduce((a,b)=>a+b,0):e[1].length})).sort((a,b)=>b.value-a.value);
        if(!arr.length) return "No data to aggregate.";
        const top=arr[0],bot=arr[arr.length-1];
        return `${agg} of ${y} by ${cat} across ${arr.length} groups: highest ${top.cat} (${fmt(top.value,2)}), lowest ${bot.cat} (${fmt(bot.value,2)}).`;
      }
      case "line":{
        if(!nums.length) return "Needs a numeric column.";
        const y=guard(cfg.y,nums),s=dataset.rows.map(r=>Number(r[y])).filter(isFinite);
        if(!s.length) return "No numeric values.";
        return `${y} over row order: ${fmt(s[0],2)} → ${fmt(s[s.length-1],2)} (net ${s[s.length-1]>=s[0]?"rise":"fall"} of ${fmt(Math.abs(s[s.length-1]-s[0]),2)}), ${s.length} points.`;
      }
      case "correlation":{
        if(nums.length<2) return "Needs two numeric columns.";
        const method=guard(cfg.method,["Pearson","Spearman"]),corr=method==="Pearson"?pearson:spearman;
        const pr=[];for(let i=0;i<nums.length;i++)for(let j=i+1;j<nums.length;j++){const c=corr(numericCol(dataset.rows,nums[i]),numericCol(dataset.rows,nums[j]));pr.push({a:nums[i],b:nums[j],r:c.r,p:corrP(c.r,c.n)});}
        const res=bh(pr.map(p=>p.p));pr.forEach((p,i)=>{p.q=res.q[i];p.sig=res.sig[i];});
        const pairs=pr.filter(p=>isFinite(p.r)).sort((x,y)=>Math.abs(y.r)-Math.abs(x.r));
        if(!pairs.length) return "No computable correlations.";
        const surv=pairs.filter(p=>p.sig),red=pairs.filter(p=>Math.abs(p.r)>0.9);
        const list=pairs.slice(0,6).map(p=>`${p.a}×${p.b} r=${fmt(p.r,2)} q=${fmt(p.q,3)}${p.sig?"*":""}`).join("; ");
        return `${method} matrix. Top pairs: ${list}. ${surv.length}/${pairs.length} survive a 5% Benjamini–Hochberg correction.${red.length?` Near-duplicate (|r|>0.9): ${red.map(p=>p.a+"–"+p.b).join(", ")}.`:""}`;
      }
      case "regression":{
        if(nums.length<2) return "Needs at least two numeric columns.";
        const y=guard(cfg.y,nums,1),seOpts=["Classical","HC1","HC2","HC3","Cluster"],seType=guard(cfg.se,seOpts,1);
        const typeMap={Classical:"classical",HC1:"HC1",HC2:"HC2",HC3:"HC3",Cluster:"cluster"};
        const clusterBy=seType==="Cluster"?(cfg.cluster&&cats.includes(cfg.cluster)?cfg.cluster:cats[0]||null):null;
        let numPreds=(cfg.preds||[]).filter(p=>nums.includes(p)&&p!==y);
        if(!numPreds.length&&!(cfg.cats||[]).length) numPreds=[nums.find(c=>c!==y)].filter(Boolean);
        const catPreds=(cfg.cats||[]).filter(c=>cats.includes(c));
        const catLevels={};catPreds.forEach(cp=>{catLevels[cp]=[...new Set(dataset.rows.map(r=>String(r[cp]==null?"":r[cp])).filter(s=>s!==""))].sort();});
        const dummyTerms=catPreds.flatMap(cp=>catLevels[cp].slice(1).map(lv=>cp+"="+lv));
        const termNames=[...numPreds,...dummyTerms];
        if(!termNames.length) return "No predictor selected.";
        const data=[];
        for(const r of dataset.rows){const yv=Number(r[y]);if(!isFinite(yv))continue;const nv=numPreds.map(p=>Number(r[p]));if(!nv.every(isFinite))continue;let ok=true;const dv=[];for(const cp of catPreds){const val=String(r[cp]==null?"":r[cp]);if(val===""){ok=false;break;}catLevels[cp].slice(1).forEach(lv=>dv.push(val===lv?1:0));}if(!ok)continue;let cid=null;if(clusterBy){cid=String(r[clusterBy]==null?"":r[clusterBy]);if(cid==="")continue;}data.push({y:yv,x:[...nv,...dv],cid});}
        const dropped=dataset.rows.length-data.length;
        if(data.length<termNames.length+2) return "Not enough complete rows to fit.";
        const useType=(seType==="Cluster"&&!clusterBy)?"HC1":typeMap[seType];
        const fit=regress(data.map(d=>d.x),data.map(d=>d.y),{type:useType,clusterIds:clusterBy?data.map(d=>d.cid):null});
        const vifs=termNames.length>=2?vif(data.map(d=>d.x)):termNames.map(()=>1);
        const terms=["(intercept)",...termNames];
        const rows=terms.map((t,i)=>`${t}: β=${fmt(fit.beta[i],4)}, se=${fmt(fit.se[i],4)}, p=${fmt(fit.p[i],4)}${pStar(fit.p[i])}${i>0&&termNames.length>=2?`, VIF=${fmt(vifs[i-1],2)}`:""}`).join(" | ");
        const seLabel=useType==="cluster"?`cluster-robust on ${clusterBy} (${fit.G} clusters)`:useType==="classical"?"classical":useType+" robust";
        const flags=[];if(vifs.some(v=>v>5))flags.push("VIF>5 (collinearity)");if(fit.n<Math.max(30,10*fit.k))flags.push("small sample");if(useType==="cluster"&&fit.G<20)flags.push("few clusters");
        return `Model: ${y} ~ ${[...numPreds,...catPreds.map(c=>"FE("+c+")")].join(" + ")||"(none)"}. n=${fit.n}${dropped?` (${dropped} rows dropped via listwise deletion)`:""}, R²=${fmt(fit.r2,3)}, adj R²=${fmt(fit.adj,3)}, ${seLabel} SE. Coefficients — ${rows}.${flags.length?` Flags: ${flags.join(", ")}.`:""}`;
      }
      case "iv":{
        if(nums.length<2) return "Needs an outcome, an endogenous regressor, and an instrument.";
        const y=guard(cfg.y,nums,0),endogOpts=nums.filter(c=>c!==y),endog=guard(cfg.endog,endogOpts);
        const instruments=(cfg.instruments||[]).filter(c=>nums.includes(c)&&c!==y&&c!==endog);
        const controls=(cfg.controls||[]).filter(c=>nums.includes(c)&&c!==y&&c!==endog&&!instruments.includes(c));
        if(!instruments.length) return `IV of ${y} on ${endog}: no instrument selected yet.`;
        const Y=[],EX=[],EN=[],ZZ=[];
        for(const r of dataset.rows){const yv=Number(r[y]),ev=Number(r[endog]);if(!isFinite(yv)||!isFinite(ev))continue;const zs=instruments.map(z=>Number(r[z]));if(!zs.every(isFinite))continue;const xs=controls.map(c=>Number(r[c]));if(!xs.every(isFinite))continue;Y.push(yv);EX.push(xs);EN.push([ev]);ZZ.push(zs);}
        if(Y.length<controls.length+instruments.length+3) return "Not enough complete rows for 2SLS.";
        const res=tsls(Y,EX,EN,ZZ,{type:"HC1"}),terms=["(intercept)",...controls,endog],ei=terms.indexOf(endog),fF=res.firstF[0];
        return `2SLS: ${y} on endogenous ${endog}, instrumented by ${instruments.join(", ")}${controls.length?` (controls: ${controls.join(", ")})`:""}. n=${res.n}, HC1 robust SE. Causal coefficient on ${endog} = ${fmt(res.beta[ei],4)} (se ${fmt(res.se[ei],4)}, p ${fmt(res.p[ei],4)}). First-stage F=${fmt(fF.F,1)} ${fF.F<10?"(WEAK instruments, F<10 — estimate unreliable)":"(instruments relevant)"}. Exclusion restriction is assumed, not tested.`;
      }
      case "did":{
        if(!nums.length) return "Needs an outcome, treated indicator, and post indicator.";
        const y=guard(cfg.y,nums,0),allC=cols.map(c=>c.field);
        const idxOpts=cols.filter(c=>c.type==="categorical"||(c.stats&&c.stats.min>=0&&c.stats.max<=1)).map(c=>c.field);
        const pool=idxOpts.length?idxOpts:allC,treat=guard(cfg.treat,pool),post=guard(cfg.post,pool.filter(c=>c!==treat).length?pool.filter(c=>c!==treat):pool);
        const useUnit=cfg.unitFE&&cfg.unitFE!=="(none)"&&allC.includes(cfg.unitFE),useTime=cfg.timeFE&&cfg.timeFE!=="(none)"&&allC.includes(cfg.timeFE);
        const tI=toIndicator(dataset.rows,treat),pI=toIndicator(dataset.rows,post);
        const recs=[];
        for(const r of dataset.rows){const yv=Number(r[y]);if(!isFinite(yv))continue;const tv=tI.fn(r),pv=pI.fn(r);if(tv==null||pv==null)continue;let u=null,tm=null;if(useUnit){u=String(r[cfg.unitFE]==null?"":r[cfg.unitFE]);if(u==="")continue;}if(useTime){tm=String(r[cfg.timeFE]==null?"":r[cfg.timeFE]);if(tm==="")continue;}recs.push({y:yv,treat:tv,post:pv,u,tm});}
        if(recs.length<6) return "Not enough complete rows for DiD.";
        const uL=useUnit?[...new Set(recs.map(r=>r.u))].sort():[],tL=useTime?[...new Set(recs.map(r=>r.tm))].sort():[];
        const X=recs.map(r=>{const row=[r.treat*r.post];if(useUnit){uL.slice(1).forEach(l=>row.push(r.u===l?1:0));}else row.push(r.treat);if(useTime){tL.slice(1).forEach(l=>row.push(r.tm===l?1:0));}else row.push(r.post);return row;});
        if(recs.length<X[0].length+2) return "Too many fixed-effect levels for the rows available.";
        const fit=regress(X,recs.map(r=>r.y),{type:"HC1"});
        return `Difference-in-differences of ${y} (treated=${treat}, post=${post}${useUnit?`, unit FE=${cfg.unitFE}`:""}${useTime?`, time FE=${cfg.timeFE}`:""}). n=${fit.n}, HC1 SE. DiD estimate (treat×post) = ${fmt(fit.beta[1],4)} (se ${fmt(fit.se[1],4)}, p ${fmt(fit.p[1],4)}${pStar(fit.p[1])}). Valid only under parallel trends (untestable here). With staggered timing, two-way FE may be biased.`;
      }
      case "forecast":{
        if(!nums.length) return "Needs a numeric column.";
        const col=guard(cfg.col,nums,nums.length-1),H=cfg.H||8,series=numericCol(dataset.rows,col);
        if(series.length<5) return `${col}: fewer than 5 observations — cannot forecast.`;
        const t=series.map((_,i)=>i+1),fit=ols(t.map(v=>[v]),series),n=series.length,tbar=(n+1)/2;
        const Sxx=t.reduce((s,v)=>s+(v-tbar)**2,0),sg=fit.sigma,tc=tInv(0.975,n-2);
        const nm=fit.beta[0]+fit.beta[1]*(n+1),nse=sg*Math.sqrt(1+1/n+((n+1)-tbar)**2/Sxx);
        const dw=durbinWatson(fit.resid),nwse=neweyWestSE(fit.X,fit.resid,fit.XtXinv)[1];
        const bt=backtest(series),beats=bt&&bt.mae<bt.naiveMae;
        return `Linear-trend forecast of ${col}: slope ${fmt(fit.beta[1],3)}/step (classical se ${fmt(fit.se[1],3)}, Newey–West HAC se ${fmt(nwse,3)}). Next step ≈ ${fmt(nm,2)}, 95% range [${fmt(nm-tc*nse,2)}, ${fmt(nm+tc*nse,2)}]; horizon ${H}. Durbin–Watson=${fmt(dw,2)} ${Math.abs(dw-2)>0.6?"(residuals autocorrelated — intervals too narrow)":"(serial correlation mild)"}. ${bt?`Backtest over ${bt.k} steps: MAE ${fmt(bt.mae,2)} vs naive MAE ${fmt(bt.naiveMae,2)} — trend ${beats?"beats":"does NOT beat"} naive.`:""}`;
      }
      case "stationarity":{
        if(!nums.length) return "Needs a numeric column.";
        const col=guard(cfg.col,nums,nums.length-1),spec=guard(cfg.spec,["Constant","Constant + trend"]),trend=spec==="Constant + trend"?"ct":"c";
        const series=numericCol(dataset.rows,col),r=adf(series,{trend}),kp=series.length>10?kpss(series,trend):null;
        if(!r) return `${col}: series too short to run the test.`;
        const adfStat=r.reject5,kpssOk=kp?!kp.nonstat5:true;
        const verdict=adfStat&&kpssOk?"appears stationary":(!adfStat&&!kpssOk)?"appears non-stationary (likely unit root)":"is ambiguous (ADF and KPSS disagree)";
        return `Stationarity of ${col} (${trend==="ct"?"constant+trend":"constant"}): ADF stat ${fmt(r.tstat,3)} vs 5% ${fmt(r.cv.p5,2)} → ${r.reject5?"reject (stationary)":"fail to reject"}. ${kp?`KPSS stat ${fmt(kp.stat,3)} vs 5% ${fmt(kp.cv.p5,2)} → ${kp.nonstat5?"reject (non-stationary)":"fail to reject"}.`:""} Combined: series ${verdict}.${verdict.indexOf("stationary")===0?"":" Difference or use growth rates first."}`;
      }
      default: return "(no summary available)";
    }
  }catch(e){ return "(could not compute: "+(e&&e.message?e.message:"error")+")"; }
}
function teacherContext(dataset,cols,blocks){
  if(!dataset) return "STATE: No dataset is loaded yet — the user has not uploaded any data. If they ask about results, tell them to load a CSV or one of the built-in samples first.";
  const L=[];
  L.push(`DATASET: "${dataset.name}" — ${dataset.rows.length} rows x ${dataset.fields.length} columns.`);
  L.push("COLUMNS:");colDigest(cols).forEach(d=>L.push("  - "+d));
  const sample=dataset.rows.slice(0,5).map(r=>"{"+dataset.fields.map(f=>f+": "+(r[f]==null?"":r[f])).join(", ")+"}");
  L.push("FIRST ROWS: "+sample.join(" | "));
  if(blocks&&blocks.length){
    L.push("","ANALYSIS BLOCKS IN THE DOCUMENT (with their computed results — these numbers are authoritative):");
    blocks.forEach((b,i)=>{const v=VIZ[b.vizId];L.push(`  [${i+1}] ${v?v.name:b.vizId}: ${blockResult(b,dataset,cols)}`);});
  } else {
    L.push("","ANALYSIS BLOCKS: none added yet. The user can add blocks (data summary, histogram, scatter, correlation matrix, OLS regression with robust/cluster SEs, instrumental variables (2SLS), difference-in-differences, forecast, ADF/KPSS stationarity) from the visualizer library.");
  }
  return L.join("\n");
}
async function askTeacher(history,context,level){
  const system=`You are the Teacher built into Candor, a local-first data-analysis workspace for economics and social-science research. You help the user understand statistical concepts and interpret the specific results they have computed in their document.

You are given the user's current dataset and the computed results of every analysis block, below. Treat these numbers as ground truth.

=== CURRENT WORKSPACE ===
${context}
=== END WORKSPACE ===

Rules:
- Use ONLY numbers that appear in the workspace context above. Never invent, guess, or estimate figures that are not there. If the user asks about something not yet computed, tell them which block or transform to add (e.g. "add a Regression block with income_pc as a predictor", or "apply the ln transform first").
- Interpret results candidly and rigorously. Distinguish association from causation; flag small samples, multicollinearity (high VIF), heteroskedasticity, autocorrelation, non-stationarity, and multiple testing. Say plainly when a result is fragile or when an assumption is likely violated.
- Know the tool's capabilities and limits. Standard errors now include classical, HC1/HC2/HC3, and cluster-robust — so on panel data, recommend clustering on the unit. Candor has Instrumental Variables (2SLS, with a first-stage weak-instrument F) and Difference-in-Differences (two-way FE, clustered SEs), so causal-identification questions can be tackled with those blocks. Still flag their assumptions: 2SLS needs a relevant (first-stage F>10) and excludable instrument (exclusion is untestable); DiD needs parallel trends and is two-way-FE only (can be biased under staggered adoption — Callaway–Sant'Anna is NOT implemented). The forecaster is a simple linear trend (not ARIMA); it now reports Durbin–Watson and a Newey–West HAC slope SE, but its prediction bands still assume i.i.d. errors and understate uncertainty under autocorrelation. The ADF test supports constant or constant+trend and is cross-checked by KPSS. There is no RD or event-study block yet.
- Match this explanation depth: ${level}. Beginner = plain language, almost no jargon, short. Intermediate = standard terminology with quick definitions. Advanced = precise and technical; estimator names and formulas are welcome.
- Be concise and direct. No preamble, no flattery. Prefer one to three short paragraphs or a tight bulleted list. Use **bold** for the key term or number in an answer, and \`backticks\` for column/variable names.`;
  const messages=history.map(m=>({role:m.role,content:m.content}));
  const resp=await fetch("/api/teacher",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({system,messages})
  });
  if(!resp.ok){let extra="";try{const j=await resp.json();extra=j.error||"";}catch{}throw new Error(`The Teacher couldn't be reached (HTTP ${resp.status}). ${extra}`.trim());}
  const data=await resp.json();
  const out=(data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("\n").trim();
  return out||"(The Teacher returned an empty response — try rephrasing your question.)";
}
function inlineNodes(s,keyBase){
  const nodes=[],re=/(\*\*([^*]+)\*\*|`([^`]+)`)/g;let last=0,m,k=0;
  while((m=re.exec(s))){if(m.index>last)nodes.push(s.slice(last,m.index));if(m[2]!=null)nodes.push(<strong key={keyBase+"b"+k}>{m[2]}</strong>);else nodes.push(<code key={keyBase+"c"+k} style={{fontFamily:"IBM Plex Mono",fontSize:"0.86em",background:"rgba(20,24,29,.07)",padding:"1px 4px",borderRadius:3}}>{m[3]}</code>);last=m.index+m[0].length;k++;}
  if(last<s.length)nodes.push(s.slice(last));
  return nodes;
}
function RichText({text}){
  const lines=String(text).split("\n"),out=[];let list=null,key=0;
  const flush=()=>{if(list){const items=list;out.push(<ul key={"u"+key++} style={{margin:"3px 0 8px",paddingLeft:18,display:"flex",flexDirection:"column",gap:3}}>{items.map((it,i)=><li key={i} style={{lineHeight:1.5}}>{inlineNodes(it,"li"+key+"_"+i)}</li>)}</ul>);list=null;}};
  lines.forEach(raw=>{const t=raw.trim();
    if(/^[-*]\s+/.test(t)){(list=list||[]).push(t.replace(/^[-*]\s+/,""));}
    else if(/^\d+\.\s+/.test(t)){(list=list||[]).push(t.replace(/^\d+\.\s+/,""));}
    else{flush();if(t==="")return;out.push(<p key={"p"+key++} style={{margin:"0 0 7px",lineHeight:1.55}}>{inlineNodes(t.replace(/^#+\s+/,""),"p"+key)}</p>);}
  });
  flush();
  return <div style={{wordBreak:"break-word"}}>{out.length?out:<span style={{color:T.muted}}>…</span>}</div>;
}
function suggestionList(docConcepts,hasData){
  const s=[];
  if(hasData){
    s.push("Summarize what this dataset shows");
    if(docConcepts.includes("regression")) s.push("Interpret my regression results");
    if(docConcepts.includes("forecast")) s.push("Is my forecast trustworthy?");
    if(docConcepts.includes("correlation")) s.push("Which correlations should I trust?");
    if(docConcepts.includes("stationarity")) s.push("Is my series stationary?");
  } else { s.push("What can Candor do?"); }
  docConcepts.forEach(c=>{if(KBI[c]&&s.length<6) s.push("Explain "+KBI[c].term.toLowerCase());});
  if(s.length<3){s.push("Difference between correlation and causation?");s.push("When should I log a variable?");}
  return [...new Set(s)].slice(0,6);
}

function ConceptCard({entry,level,defaultOpen}){
  const [open,setOpen]=useState(!!defaultOpen);
  const text=level==="Advanced"?entry.A:level==="Intermediate"?entry.I:entry.B;
  return (<div className="card" style={{marginBottom:8,overflow:"hidden"}}>
    <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"11px 13px",background:"transparent",border:"none",cursor:"pointer",textAlign:"left"}}><BookOpen size={15} style={{color:T.interval,flexShrink:0}}/><span style={{fontSize:14,fontWeight:600,flex:1}}>{entry.term}</span><span style={{color:T.muted,fontSize:18,lineHeight:1}}>{open?"–":"+"}</span></button>
    {open&&<div style={{padding:"0 13px 13px"}}><p style={{fontSize:13.5,lineHeight:1.6,color:T.inkSoft,margin:"0 0 10px"}}>{text}</p><div style={{display:"flex",gap:8,alignItems:"flex-start",background:T.paper,borderRadius:4,padding:"9px 11px"}}><ShieldAlert size={13} style={{color:T.point,marginTop:2,flexShrink:0}}/><span style={{fontSize:12.5,color:T.muted,lineHeight:1.5}}>{entry.watch}</span></div></div>}
  </div>);
}
function TeacherPanel({onClose,level,setLevel,docConcepts,hasData,messages,busy,error,onSend}){
  const [input,setInput]=useState("");
  const endRef=useRef(null);
  useEffect(()=>{if(endRef.current)endRef.current.scrollIntoView({behavior:"smooth",block:"end"});},[messages,busy]);
  const send=()=>{const t=input.trim();if(!t||busy)return;setInput("");onSend(t);};
  const sugg=suggestionList(docConcepts,hasData);
  return (<div className="tpanel">
    <div style={{padding:"13px 16px",borderBottom:"1px solid "+T.line,display:"flex",alignItems:"center",gap:9}}>
      <GraduationCap size={18} style={{color:T.interval,flexShrink:0}}/>
      <div style={{flex:1,minWidth:0}}><div className="fdisplay" style={{fontSize:17,fontWeight:600,lineHeight:1}}>Teacher</div><div className="fmono" style={{fontSize:9.5,color:T.muted,letterSpacing:"0.05em",marginTop:3}}>AI · READS YOUR DATA &amp; RESULTS</div></div>
      <button className="iconbtn" onClick={onClose}><X size={17}/></button>
    </div>
    <div style={{padding:"10px 16px",borderBottom:"1px solid "+T.line}}><div className="fmono" style={{fontSize:10,color:T.muted,marginBottom:6,letterSpacing:"0.06em"}}>EXPLANATION DEPTH</div><div style={{display:"flex",gap:4}}>{["Beginner","Intermediate","Advanced"].map(l=>(<button key={l} onClick={()=>setLevel(l)} className="btn btn-sm" style={{flex:1,justifyContent:"center",fontSize:12,background:level===l?T.interval:"transparent",color:level===l?"#fff":T.muted,border:level===l?"none":"1px solid "+T.line}}>{l}</button>))}</div></div>
    <div className="scrollbox" style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:11}}>
      {messages.length===0&&(<div>
        <div style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:14}}><div style={{width:26,height:26,borderRadius:"50%",background:T.paper,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:T.interval}}><GraduationCap size={15}/></div><div style={{fontSize:13.5,color:T.inkSoft,lineHeight:1.55,paddingTop:2}}>Ask me about your data or any result in this document. {hasData?"I can read your columns and the output of every block you've added — and I'll only use the numbers actually computed here.":"Load a dataset and I'll help you interpret what you find."}</div></div>
        <div className="fmono" style={{fontSize:9.5,color:T.muted,letterSpacing:"0.06em",marginBottom:8}}>TRY ASKING</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>{sugg.map((q,i)=>(<button key={i} onClick={()=>onSend(q)} disabled={busy} className="suggrow" style={{textAlign:"left",border:"1px solid "+T.line,background:T.surface,borderRadius:6,padding:"9px 11px",fontSize:13,color:T.ink,cursor:busy?"not-allowed":"pointer",lineHeight:1.4}}>{q}</button>))}</div>
      </div>)}
      {messages.map((m,i)=> m.role==="user"
        ? (<div key={i} style={{alignSelf:"flex-end",maxWidth:"86%",background:T.interval,color:"#fff",borderRadius:"10px 10px 2px 10px",padding:"8px 12px",fontSize:13.5,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{m.content}</div>)
        : (<div key={i} style={{alignSelf:"flex-start",maxWidth:"95%",display:"flex",gap:8}}><div style={{width:24,height:24,borderRadius:"50%",background:T.paper,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:T.interval,marginTop:1}}><GraduationCap size={13}/></div><div style={{background:T.paper,borderRadius:"10px 10px 10px 2px",padding:"9px 12px",fontSize:13.5,color:T.ink,minWidth:0,overflow:"hidden"}}><RichText text={m.content}/></div></div>)
      )}
      {busy&&(<div style={{alignSelf:"flex-start",display:"flex",gap:8,alignItems:"center",color:T.muted}}><div style={{width:24,height:24,borderRadius:"50%",background:T.paper,display:"flex",alignItems:"center",justifyContent:"center",color:T.interval}}><GraduationCap size={13}/></div><Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/><span style={{fontSize:12.5}}>Reading your results…</span></div>)}
      {error&&(<div style={{background:"rgba(168,64,58,.08)",border:"1px solid "+T.danger,borderRadius:6,padding:"9px 11px",fontSize:12.5,color:T.danger,lineHeight:1.5}}>{error}</div>)}
      <div ref={endRef}/>
    </div>
    <div style={{padding:"10px 12px",borderTop:"1px solid "+T.line}}>
      <div style={{display:"flex",alignItems:"flex-end",gap:7,border:"1px solid "+T.line,borderRadius:8,padding:"6px 7px 6px 11px"}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Ask about your data or a result…" rows={1} style={{border:"none",outline:"none",resize:"none",flex:1,fontSize:13.5,fontFamily:"IBM Plex Sans",background:"transparent",maxHeight:120,lineHeight:1.45,color:T.ink}}/>
        <button onClick={send} disabled={busy||!input.trim()} title="Send" style={{border:"none",cursor:busy||!input.trim()?"default":"pointer",background:input.trim()&&!busy?T.interval:"transparent",color:input.trim()&&!busy?"#fff":T.muted,borderRadius:6,padding:"7px",display:"inline-flex",alignSelf:"flex-end"}}><ArrowRight size={16}/></button>
      </div>
      <div style={{fontSize:10.5,color:T.muted,lineHeight:1.45,marginTop:7,display:"flex",gap:5,alignItems:"flex-start"}}><ShieldAlert size={11} style={{color:T.point,flexShrink:0,marginTop:1}}/><span>The Teacher uses an AI model (Claude) reading your computed results. The statistics themselves are still computed locally — verify the interpretation against the numbers in your document.</span></div>
    </div>
  </div>);
}
function TransformModal({cols,onClose,onApply}){
  const nums=cols.filter(c=>c.type==="numeric").map(c=>c.field);
  const [col,setCol]=useState(nums[0]||"");const [op,setOp]=useState("ln");
  const ops=[["ln","Natural log — ln(x)","stabilizes scale; enables elasticities"],["growth","Growth rate — % change","period-over-period percent change"],["diff","First difference — Δx","removes a trend / unit root"],["z","Standardize — z-score","mean 0, sd 1; comparable scales"],["lag1","Lag by one row","previous period's value"]];
  const prefix={ln:"log_",growth:"growth_",diff:"diff_",z:"z_",lag1:"lag1_"}[op];
  if(!nums.length)return (<div className="overlay" onMouseDown={onClose}><div className="card" style={{padding:20,fontSize:13.5,color:T.muted}} onMouseDown={e=>e.stopPropagation()}>No numeric columns to transform.</div></div>);
  return (<div className="overlay" onMouseDown={onClose}><div className="card" style={{width:470,maxWidth:"100%",overflow:"hidden"}} onMouseDown={e=>e.stopPropagation()}>
    <div style={{display:"flex",alignItems:"center",gap:9,padding:"14px 16px",borderBottom:"1px solid "+T.line}}><Sigma size={17} style={{color:T.interval}}/><span className="fdisplay" style={{fontSize:17,fontWeight:600,flex:1}}>Transform column</span><button className="iconbtn" onClick={onClose}><X size={17}/></button></div>
    <div style={{padding:"16px"}}>
      <div style={{marginBottom:14}}><Selector label="column" value={col} onChange={setCol} options={nums}/></div>
      <div className="fmono" style={{fontSize:10.5,color:T.muted,marginBottom:7,letterSpacing:"0.05em"}}>OPERATION</div>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>{ops.map(o=>(<button key={o[0]} onClick={()=>setOp(o[0])} style={{textAlign:"left",padding:"9px 12px",borderRadius:4,border:"1px solid "+(op===o[0]?T.interval:T.line),background:op===o[0]?"rgba(44,110,143,.08)":"transparent",cursor:"pointer",color:T.ink}}><div style={{fontSize:13.5,fontWeight:600}}>{o[1]}</div><div style={{fontSize:11.5,color:T.muted}}>{o[2]}</div></button>))}</div>
      <div style={{fontSize:12.5,color:T.muted,marginBottom:14}}>Adds column <span className="fmono" style={{color:T.interval}}>{prefix}{col}</span> to your data.</div>
      <button className="btn btn-primary btn-sm" style={{width:"100%",justifyContent:"center"}} onClick={()=>onApply(col,op)}>Create column</button>
    </div>
  </div></div>);
}
function Block({block,dataset,cols,onConfig,onRemove,onExplain,onMove,canUp,canDown}){
  const v=VIZ[block.vizId];if(!v)return null;const Comp=v.Comp;
  return (<div className="card fade" style={{marginBottom:16,overflow:"hidden"}}>
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderBottom:"1px solid "+T.line}}>
      <v.icon size={16} style={{color:T.interval,flexShrink:0}}/>
      <div style={{flex:1,minWidth:0}}><div style={{fontSize:14.5,fontWeight:600,lineHeight:1.2}}>{v.name}</div><div className="fmono" style={{fontSize:10,color:T.muted,letterSpacing:"0.05em"}}>{v.cat.toUpperCase()}</div></div>
      <button className="iconbtn" title="Move up" onClick={()=>onMove(-1)} disabled={!canUp} style={{opacity:canUp?1:.3}}><ChevronUp size={16}/></button>
      <button className="iconbtn" title="Move down" onClick={()=>onMove(1)} disabled={!canDown} style={{opacity:canDown?1:.3}}><ChevronDown size={16}/></button>
      <button className="iconbtn" title="Explain this with the Teacher" onClick={()=>onExplain(v.concept)}><GraduationCap size={16}/></button>
      <button className="iconbtn" title="Remove block" onClick={onRemove}><Trash2 size={14}/></button>
    </div>
    <div style={{padding:"14px 16px"}}><Comp dataset={dataset} cols={cols} config={block.config||{}} onConfig={onConfig}/></div>
  </div>);
}
function SearchPalette({onClose,onPick}){
  const [q,setQ]=useState("");const ql=q.trim().toLowerCase();
  const list=VISUALIZERS.filter(v=>!ql||(v.name+" "+v.kw+" "+v.cat).toLowerCase().includes(ql));
  return (<div className="overlay" onMouseDown={onClose}>
    <div className="card" style={{width:560,maxWidth:"100%",maxHeight:"70vh",display:"flex",flexDirection:"column",overflow:"hidden"}} onMouseDown={e=>e.stopPropagation()}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",borderBottom:"1px solid "+T.line}}><Search size={18} style={{color:T.muted}}/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search visualizations — scatter, histogram, correlation, forecast…" style={{border:"none",outline:"none",flex:1,fontSize:15,fontFamily:"IBM Plex Sans",background:"transparent"}}/><button className="iconbtn" onClick={onClose}><X size={18}/></button></div>
      <div className="scrollbox" style={{overflowY:"auto",padding:"8px"}}>{list.length===0?<p style={{padding:16,fontSize:13.5,color:T.muted}}>No visualizer matches “{q}”.</p>:list.map(v=>(<button key={v.id} className="vizrow" onClick={()=>onPick(v.id)}><div style={{width:34,height:34,borderRadius:4,background:T.paper,display:"flex",alignItems:"center",justifyContent:"center",color:T.interval,flexShrink:0}}><v.icon size={17}/></div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{v.name}</div><div style={{fontSize:12.5,color:T.muted}}>{v.cat}</div></div><Plus size={16} style={{color:T.muted,alignSelf:"center"}}/></button>))}</div>
    </div>
  </div>);
}
function RBtn({icon:Ic,label,onClick,active,disabled,danger}){return <button className="rbtn" onClick={onClick} disabled={disabled} style={{color:danger?T.danger:(active?T.interval:T.ink),background:active?"rgba(44,110,143,.1)":undefined}}><Ic size={19}/><span>{label}</span></button>;}
function RGroup({label,children}){return <div className="rgroup"><div className="rgroup-btns">{children}</div><div className="rgroup-label">{label}</div></div>;}
function ConnectorsModal({source,onClose,onImport}){
  const [src,setSrc]=useState(source||"wb");
  const [loading,setLoading]=useState(false),[error,setError]=useState(null);
  const [ind,setInd]=useState(WB_INDICATORS[0].code);
  const [countries,setCountries]=useState(["USA","CHN","DEU","JPN"]);
  const [fred,setFred]=useState("GDPC1"),[bls,setBls]=useState("CUUR0000SA0");
  function toggleC(iso){setCountries(cs=>cs.includes(iso)?cs.filter(x=>x!==iso):[...cs,iso]);}
  async function run(fn){setLoading(true);setError(null);try{const ds=await fn();onImport(ds);}catch(e){setError(e.message||String(e));}finally{setLoading(false);}}
  function go(){if(src==="wb"){const indicator=WB_INDICATORS.find(i=>i.code===ind);const cs=WB_COUNTRIES.filter(c=>countries.includes(c.iso));if(!cs.length){setError("Pick at least one country.");return;}run(()=>fetchWorldBank(indicator,cs));}else if(src==="fred")run(()=>fetchFred(fred));else run(()=>fetchBls(bls));}
  const link=src==="fred"?"https://fred.stlouisfed.org/series/"+fred.trim():src==="bls"?"https://data.bls.gov/timeseries/"+bls.trim():"https://data.worldbank.org";
  const tabs=[["wb","World Bank"],["fred","FRED"],["bls","BLS"]];
  return (<div className="overlay" onMouseDown={onClose}><div className="card" style={{width:560,maxWidth:"100%",maxHeight:"82vh",display:"flex",flexDirection:"column",overflow:"hidden"}} onMouseDown={e=>e.stopPropagation()}>
    <div style={{display:"flex",alignItems:"center",gap:9,padding:"14px 16px",borderBottom:"1px solid "+T.line}}><Globe size={18} style={{color:T.interval}}/><span className="fdisplay" style={{fontSize:17,fontWeight:600,flex:1}}>Get external data</span><button className="iconbtn" onClick={onClose}><X size={17}/></button></div>
    <div style={{display:"flex",borderBottom:"1px solid "+T.line}}>{tabs.map(t=>(<button key={t[0]} className={"rtab"+(src===t[0]?" on":"")} onClick={()=>{setSrc(t[0]);setError(null);}} style={{flex:1}}>{t[1]}</button>))}</div>
    <div className="scrollbox" style={{padding:"16px",overflowY:"auto"}}>
      {src==="wb"&&(<div>
        <p style={{fontSize:12.5,color:T.muted,margin:"0 0 14px",lineHeight:1.5}}><Check size={12} style={{color:T.interval,verticalAlign:"-1px"}}/> World Bank Open Data works directly in your browser — no key needed. Returns a country–year panel, ideal for fixed-effects regression.</p>
        <div style={{marginBottom:14}}><Selector label="indicator" value={ind} onChange={setInd} options={WB_INDICATORS.map(i=>i.code)}/><div style={{fontSize:12,color:T.muted,marginTop:4}}>{WB_INDICATORS.find(i=>i.code===ind).label}</div></div>
        <div className="fmono" style={{fontSize:10.5,color:T.muted,marginBottom:7,letterSpacing:"0.05em"}}>COUNTRIES</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{WB_COUNTRIES.map(c=>(<button key={c.iso} onClick={()=>toggleC(c.iso)} className="btn btn-sm fmono" style={{fontSize:11.5,background:countries.includes(c.iso)?T.interval:"transparent",color:countries.includes(c.iso)?"#fff":T.muted,border:countries.includes(c.iso)?"none":"1px solid "+T.line}}>{c.name}</button>))}</div>
      </div>)}
      {src==="fred"&&(<div>
        <p style={{fontSize:12.5,color:T.muted,margin:"0 0 14px",lineHeight:1.5}}><AlertTriangle size={12} style={{color:T.point,verticalAlign:"-1px"}}/> FRED may block direct browser requests (CORS). If the fetch fails, open the series and download CSV, then use Upload CSV.</p>
        <Selector label="series id" value={fred} onChange={setFred} options={FRED_PRESETS.map(p=>p[0])}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>{FRED_PRESETS.map(p=>(<button key={p[0]} className="chip" onClick={()=>setFred(p[0])} title={p[1]}>{p[0]}</button>))}</div>
        <div style={{fontSize:12,color:T.muted,marginTop:8}}>Or type any FRED series ID (e.g. <span className="fmono">GDPC1</span>, <span className="fmono">UNRATE</span>).</div>
      </div>)}
      {src==="bls"&&(<div>
        <p style={{fontSize:12.5,color:T.muted,margin:"0 0 14px",lineHeight:1.5}}><AlertTriangle size={12} style={{color:T.point,verticalAlign:"-1px"}}/> The BLS API often blocks browser requests and needs a key for volume. If the fetch fails, download from the link below and use Upload CSV.</p>
        <Selector label="series id" value={bls} onChange={setBls} options={BLS_PRESETS.map(p=>p[0])}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>{BLS_PRESETS.map(p=>(<button key={p[0]} className="chip" onClick={()=>setBls(p[0])} title={p[1]}>{p[0]}</button>))}</div>
      </div>)}
      {error&&(<div style={{marginTop:14,background:"rgba(168,64,58,.07)",border:"1px solid rgba(168,64,58,.3)",borderRadius:5,padding:"11px 13px"}}>
        <div style={{display:"flex",gap:8,alignItems:"flex-start"}}><AlertTriangle size={14} style={{color:T.danger,marginTop:2,flexShrink:0}}/><div style={{fontSize:13,color:T.ink,lineHeight:1.5}}>{error}<div style={{marginTop:6,fontSize:12.5,color:T.muted}}>Open the source to download a CSV: <a href={link} target="_blank" rel="noreferrer" style={{color:T.interval,fontWeight:600}}>{link.replace("https://","")}</a></div></div></div>
      </div>)}
    </div>
    <div style={{padding:"12px 16px",borderTop:"1px solid "+T.line,display:"flex",alignItems:"center",gap:10}}>
      <a href={link} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{fontSize:12.5}}><Link2 size={14}/>Open source</a>
      <button className="btn btn-primary btn-sm" onClick={go} disabled={loading} style={{marginLeft:"auto"}}>{loading?<><Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/>Fetching…</>:<><Download size={15}/>Import data</>}</button>
    </div>
  </div></div>);
}
function TemplateGallery({onPick}){
  return (<div className="fade" style={{maxWidth:920,margin:"0 auto",padding:"34px 26px"}}>
    <div className="eyebrow" style={{marginBottom:8}}>New document</div>
    <h2 className="fdisplay" style={{fontSize:28,fontWeight:600,margin:"0 0 6px"}}>Choose a template</h2>
    <p style={{fontSize:14.5,color:T.muted,margin:"0 0 26px",maxWidth:560}}>Each template starts your document with the right blocks. Add, configure, or remove any of them afterward — or start blank and search the visualizer library yourself.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:16}}>{TEMPLATES.map(t=>(<button key={t.id} className="tplcard" onClick={()=>onPick(t)}>
      <div style={{height:92,background:T.ink,display:"flex",alignItems:"center",justifyContent:"center"}}><t.icon size={30} style={{color:T.pointSoft}}/></div>
      <div style={{padding:"14px 16px"}}><div className="fdisplay" style={{fontSize:17,fontWeight:600,marginBottom:5}}>{t.name}</div><div style={{fontSize:13,color:T.muted,lineHeight:1.5}}>{t.desc}</div><div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:11}}>{t.blocks.length?t.blocks.map((b,i)=><span key={i} className="fmono" style={{fontSize:9.5,color:T.interval,background:T.paper,borderRadius:10,padding:"2px 8px"}}>{VIZ[b].name}</span>):<span className="fmono" style={{fontSize:10,color:T.muted}}>empty document</span>}</div></div>
    </button>))}</div>
  </div>);
}

function TBSep(){return <span style={{width:1,height:22,background:T.line,margin:"0 4px"}}/>;}
function WorkspaceApp({onBack}){
  const [docs,setDocs]=useState([]);
  const [activeId,setActiveId]=useState(null);
  const [saveState,setSaveState]=useState("nostore");
  const [editingName,setEditingName]=useState(false);
  const [teacher,setTeacher]=useState(true),[level,setLevel]=useState("Beginner");
  const [teacherOpen,setTeacherOpen]=useState(false);
  const [teacherMsgs,setTeacherMsgs]=useState([]),[teacherBusy,setTeacherBusy]=useState(false),[teacherErr,setTeacherErr]=useState(null);
  const [paletteOpen,setPaletteOpen]=useState(false),[transformOpen,setTransformOpen]=useState(false);
  const [ribbon,setRibbon]=useState("home"),[connOpen,setConnOpen]=useState(false),[connSrc,setConnSrc]=useState("wb");
  const csvRef=useRef(null),importRef=useRef(null);

  useEffect(()=>{let on=true;(async()=>{const loaded=await loadStore();if(!on)return;if(loaded&&loaded.length){setDocs(loaded);setActiveId(loaded[0].id);setSaveState(hasStore()?"saved":"nostore");}else{const d=newDoc("Untitled document");setDocs([d]);setActiveId(d.id);setSaveState(hasStore()?"unsaved":"nostore");}})();return()=>{on=false;};},[]);

  const active=docs.find(d=>d.id===activeId)||docs[0]||null;
  const cols=useMemo(()=>active&&active.dataset?inferColumns(active.dataset.rows,active.dataset.fields,active.colTypes||{}):[],[active]);
  const teacherCtx=useMemo(()=>teacherContext(active&&active.dataset?active.dataset:null,cols,active?active.blocks:[]),[active,cols]);
  const hasData=!!(active&&active.dataset);
  const showGallery=active&&active.template===null;
  function markDirty(){setSaveState(s=>s==="nostore"?"nostore":"unsaved");}
  function patchActive(patch){setDocs(ds=>ds.map(d=>d.id===active.id?{...d,...patch}:d));markDirty();}

  function newDocument(){const d=newDoc("Untitled document "+(docs.length+1));setDocs(ds=>[...ds,d]);setActiveId(d.id);markDirty();}
  function applyTemplate(t){patchActive({template:t.id,name:active.name.startsWith("Untitled")?t.name:active.name,blocks:t.blocks.map(id=>({id:uid("b"),vizId:id,config:{}}))});}
  function deleteDoc(id){setDocs(ds=>{const next=ds.filter(d=>d.id!==id);if(next.length===0){const nd=newDoc("Untitled document");setActiveId(nd.id);return [nd];}if(id===activeId)setActiveId(next[0].id);return next;});markDirty();}
  function loadCSV(file){Papa.parse(file,{header:true,skipEmptyLines:true,dynamicTyping:true,complete:(r)=>{const fields=r.meta.fields||Object.keys(r.data[0]||{});patchActive({dataset:{name:file.name,rows:r.data,fields}});}});}
  function loadSample(d){patchActive({dataset:d});}
  function importExternal(ds){patchActive({dataset:ds});setConnOpen(false);}
  function openConn(s){setConnSrc(s);setConnOpen(true);}
  function addBlock(vizId){patchActive({blocks:[...(active.blocks||[]),{id:uid("b"),vizId,config:{}}]});setPaletteOpen(false);}
  function toggleColType(field){const cur=cols.find(c=>c.field===field);if(!cur)return;const next=cur.type==="numeric"?"categorical":"numeric";patchActive({colTypes:{...(active.colTypes||{}),[field]:next}});}
  function removeBlock(bid){patchActive({blocks:active.blocks.filter(b=>b.id!==bid)});}
  function updateBlockConfig(bid,patch){patchActive({blocks:active.blocks.map(b=>b.id===bid?{...b,config:{...(b.config||{}),...patch}}:b)});}
  function moveBlock(bid,dir){const arr=[...active.blocks];const i=arr.findIndex(b=>b.id===bid),j=i+dir;if(j<0||j>=arr.length)return;const t=arr[i];arr[i]=arr[j];arr[j]=t;patchActive({blocks:arr});}
  function addTransform(col,op){const {prefix,vals}=transformCol(active.dataset.rows,col,op);const name=prefix+col;const rows=active.dataset.rows.map((r,i)=>({...r,[name]:vals[i]}));const fields=active.dataset.fields.includes(name)?active.dataset.fields:[...active.dataset.fields,name];patchActive({dataset:{...active.dataset,rows,fields}});setTransformOpen(false);}
  async function sendTeacher(text){const content=(text||"").trim();if(!content||teacherBusy)return;const next=[...teacherMsgs,{role:"user",content}];setTeacherMsgs(next);setTeacherBusy(true);setTeacherErr(null);try{const reply=await askTeacher(next,teacherCtx,level);setTeacherMsgs(m=>[...m,{role:"assistant",content:reply}]);}catch(e){setTeacherErr(e&&e.message?e.message:"The request failed — check your connection and try again.");}finally{setTeacherBusy(false);}}
  function explain(concept){setTeacher(true);setTeacherOpen(true);const term=KBI[concept]?KBI[concept].term:concept;sendTeacher(`Explain "${term}" and how it applies to the results in my current document.`);}

  async function doSave(){if(!hasStore()){exportProject();return;}setSaveState("saving");const ok=await saveStore(docs);setSaveState(ok?"saved":"error");}
  function exportProject(){if(!active)return;downloadText((active.name||"document").replace(/[^\w]+/g,"_")+".candor.json",JSON.stringify({app:"candor",version:2,document:active},null,2),"application/json");}
  function importProject(file){const reader=new FileReader();reader.onload=()=>{try{const obj=JSON.parse(reader.result);const doc=obj.document||obj.project||obj;const d={...newDoc(doc.name||"Imported document",doc.template||"blank"),dataset:doc.dataset||null,blocks:doc.blocks||[]};setDocs(ds=>[...ds,d]);setActiveId(d.id);markDirty();}catch{alert("That file isn't a Candor document export.");}};reader.readAsText(file);}
  function exportReport(){if(!hasData)return;downloadText((active.name||"report").replace(/[^\w]+/g,"_")+"_report.md",buildReport(active.dataset,cols,active.blocks),"text/markdown");}
  function exportCSV(){if(!hasData)return;downloadText((active.name||"data").replace(/[^\w]+/g,"_")+".csv",Papa.unparse(active.dataset.rows),"text/csv");}

  const docConcepts=active&&active.blocks?[...new Set(active.blocks.map(b=>VIZ[b.vizId]&&VIZ[b.vizId].concept).filter(Boolean))]:[];
  const saveLabel={saved:"Saved",unsaved:"Unsaved",saving:"Saving…",error:"Save failed",nostore:"Session only"}[saveState];
  const saveColor={saved:T.interval,unsaved:T.point,saving:T.muted,error:T.danger,nostore:T.muted}[saveState];
  if(!active)return <div className="candor" style={{padding:40}}/>;

  return (
    <div className="candor" style={{minHeight:"100vh",display:"flex",flexDirection:"column",height:"100vh"}}>
      <input ref={csvRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>{if(e.target.files[0])loadCSV(e.target.files[0]);e.target.value="";}}/>
      <input ref={importRef} type="file" accept=".json" style={{display:"none"}} onChange={e=>{if(e.target.files[0])importProject(e.target.files[0]);e.target.value="";}}/>

      <div style={{background:T.ink,color:T.paper,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 14px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}><button className="iconbtn" onClick={onBack} title="Back to overview" style={{color:"#9FB0BD"}}><Home size={16}/></button><Wordmark small light/></div>
        <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}>{editingName?
          <input autoFocus value={active.name} onChange={e=>patchActive({name:e.target.value})} onBlur={()=>setEditingName(false)} onKeyDown={e=>{if(e.key==="Enter")setEditingName(false);}} style={{background:"#222932",color:T.paper,border:"1px solid "+T.interval,borderRadius:3,padding:"3px 8px",fontFamily:"IBM Plex Sans",fontSize:13.5,width:220}}/>
          :<button onClick={()=>setEditingName(true)} className="fmono" style={{background:"transparent",border:"none",color:T.paper,fontSize:13.5,cursor:"pointer",display:"flex",alignItems:"center",gap:6,maxWidth:280,overflow:"hidden"}} title="Rename document"><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{active.name}</span><Pencil size={12} style={{color:"#9FB0BD",flexShrink:0}}/></button>}</div>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <button onClick={()=>setTeacher(t=>!t)} title="Toggle Teacher" className="fmono" style={{display:"flex",alignItems:"center",gap:7,background:teacher?"rgba(232,181,99,.16)":"transparent",border:"1px solid "+(teacher?T.pointSoft:"#3A434E"),color:teacher?T.pointSoft:"#9FB0BD",borderRadius:14,padding:"4px 11px",cursor:"pointer",fontSize:11}}><GraduationCap size={14}/>Teacher {teacher?"on":"off"}</button>
          {teacher&&<button onClick={()=>setTeacherOpen(o=>!o)} className="btn btn-sm" style={{background:teacherOpen?T.interval:"transparent",color:teacherOpen?"#fff":T.paper,border:"1px solid #3A434E",fontSize:12}}><HelpCircle size={14}/>Help</button>}
          <TBSep/>
          <span className="fmono" style={{fontSize:11,color:saveColor,display:"flex",alignItems:"center",gap:5}}><span style={{width:7,height:7,borderRadius:"50%",background:saveColor}}/>{saveLabel}</span>
          <button className="btn btn-sm" onClick={doSave} style={{background:T.interval,color:"#fff",fontSize:12.5}}><Save size={14}/>Save</button>
        </div>
      </div>

      <div style={{background:T.surface,borderBottom:"1px solid "+T.line,display:"flex",flexShrink:0,overflowX:"auto"}} className="scrollbox">
        {[["home","Home"],["insert","Insert"],["data","Data"],["analyze","Analyze"],["teacher","Teacher"],["export","Export"]].map(t=>(<button key={t[0]} className={"rtab"+(ribbon===t[0]?" on":"")} onClick={()=>setRibbon(t[0])}>{t[1]}</button>))}
      </div>
      <div className="scrollbox" style={{background:T.ribbon,borderBottom:"1px solid "+T.line,display:"flex",overflowX:"auto",flexShrink:0,minHeight:96,alignItems:"stretch"}}>
        {ribbon==="home"&&(<>
          <RGroup label="Document"><RBtn icon={FileText} label="New" onClick={newDocument}/><RBtn icon={Pencil} label="Rename" onClick={()=>setEditingName(true)}/><RBtn icon={Trash2} label="Delete" danger onClick={()=>deleteDoc(active.id)}/></RGroup>
          <RGroup label="File"><RBtn icon={Save} label="Save" onClick={doSave}/><RBtn icon={FolderOpen} label="Open" onClick={()=>importRef.current.click()}/><RBtn icon={Download} label="Save as" onClick={exportProject}/></RGroup>
          <RGroup label="Insert"><RBtn icon={Plus} label="Add visualization" onClick={()=>setPaletteOpen(true)} disabled={!hasData||showGallery}/></RGroup>
        </>)}
        {ribbon==="insert"&&(<>
          <RGroup label="Charts"><RBtn icon={CircleDot} label="Scatter" onClick={()=>addBlock("scatter")} disabled={!hasData}/><RBtn icon={BarChart3} label="Histogram" onClick={()=>addBlock("histogram")} disabled={!hasData}/><RBtn icon={Activity} label="Line" onClick={()=>addBlock("line")} disabled={!hasData}/><RBtn icon={BarChart3} label="Bar" onClick={()=>addBlock("bar")} disabled={!hasData}/></RGroup>
          <RGroup label="Tables"><RBtn icon={TableIcon} label="Summary" onClick={()=>addBlock("summary")} disabled={!hasData}/><RBtn icon={TableIcon} label="Preview" onClick={()=>addBlock("preview")} disabled={!hasData}/></RGroup>
          <RGroup label="Library"><RBtn icon={Search} label="Search library" onClick={()=>setPaletteOpen(true)} disabled={!hasData}/></RGroup>
        </>)}
        {ribbon==="data"&&(<>
          <RGroup label="Import"><RBtn icon={Upload} label="Upload CSV" onClick={()=>csvRef.current.click()}/><RBtn icon={FolderOpen} label="Open project" onClick={()=>importRef.current.click()}/></RGroup>
          <RGroup label="Samples"><RBtn icon={Database} label="Regions" onClick={()=>loadSample(sampleCrossSection())}/><RBtn icon={Database} label="Time series" onClick={()=>loadSample(sampleTimeSeries())}/></RGroup>
          <RGroup label="Prepare"><RBtn icon={Sigma} label="Transform" onClick={()=>setTransformOpen(true)} disabled={!hasData}/></RGroup>
          <RGroup label="Get external data"><RBtn icon={Globe} label="World Bank" onClick={()=>openConn("wb")}/><RBtn icon={Globe} label="FRED" onClick={()=>openConn("fred")}/><RBtn icon={Globe} label="BLS" onClick={()=>openConn("bls")}/></RGroup>
        </>)}
        {ribbon==="analyze"&&(<>
          <RGroup label="Relationships"><RBtn icon={LayoutGrid} label="Correlation" onClick={()=>addBlock("correlation")} disabled={!hasData}/><RBtn icon={CircleDot} label="Scatter" onClick={()=>addBlock("scatter")} disabled={!hasData}/></RGroup>
          <RGroup label="Models"><RBtn icon={Sigma} label="Regression" onClick={()=>addBlock("regression")} disabled={!hasData}/><RBtn icon={TrendingUp} label="Forecast" onClick={()=>addBlock("forecast")} disabled={!hasData}/></RGroup>
          <RGroup label="Causal"><RBtn icon={Link2} label="IV / 2SLS" onClick={()=>addBlock("iv")} disabled={!hasData}/><RBtn icon={LayoutGrid} label="Diff-in-diff" onClick={()=>addBlock("did")} disabled={!hasData}/></RGroup>
          <RGroup label="Time series"><RBtn icon={Activity} label="Stationarity" onClick={()=>addBlock("stationarity")} disabled={!hasData}/><RBtn icon={Activity} label="Line" onClick={()=>addBlock("line")} disabled={!hasData}/></RGroup>
        </>)}
        {ribbon==="teacher"&&(<>
          <RGroup label="Mode"><RBtn icon={GraduationCap} label={teacher?"Teacher on":"Teacher off"} active={teacher} onClick={()=>setTeacher(t=>!t)}/><RBtn icon={HelpCircle} label="Help panel" active={teacherOpen} disabled={!teacher} onClick={()=>setTeacherOpen(o=>!o)}/></RGroup>
          <RGroup label="Explanation depth">{["Beginner","Intermediate","Advanced"].map(l=><RBtn key={l} icon={BookOpen} label={l} active={teacher&&level===l} disabled={!teacher} onClick={()=>setLevel(l)}/>)}</RGroup>
        </>)}
        {ribbon==="export"&&(<>
          <RGroup label="Findings"><RBtn icon={FileText} label="Report (.md)" onClick={exportReport} disabled={!hasData}/></RGroup>
          <RGroup label="Data"><RBtn icon={FileSpreadsheet} label="Data (.csv)" onClick={exportCSV} disabled={!hasData}/><RBtn icon={Download} label="Project (.json)" onClick={exportProject}/></RGroup>
        </>)}
      </div>

      <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr",minHeight:0}} className="ws-grid">
        <aside style={{borderRight:"1px solid "+T.line,background:T.surface,padding:"14px 12px",display:"flex",flexDirection:"column",gap:16,overflowY:"auto"}} className="scrollbox">
          <div><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><span className="fmono" style={{fontSize:10.5,color:T.muted,letterSpacing:"0.08em"}}>DOCUMENTS</span><button className="iconbtn" onClick={newDocument} title="New document"><Plus size={15}/></button></div>
            <div style={{display:"flex",flexDirection:"column",gap:2}}>{docs.map(d=>(<div key={d.id} className={"projitem"+(d.id===activeId?" on":"")} onClick={()=>setActiveId(d.id)} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 9px",borderRadius:3,cursor:"pointer",fontSize:13,background:d.id===activeId?T.paper:"transparent",fontWeight:d.id===activeId?600:400}}><FileText size={14} style={{color:d.id===activeId?T.interval:T.muted,flexShrink:0}}/><span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.name}</span>{d.dataset&&<span style={{width:6,height:6,borderRadius:"50%",background:T.interval,flexShrink:0}}/>}<button className="iconbtn" onClick={e=>{e.stopPropagation();if(confirm("Delete \""+d.name+"\"?"))deleteDoc(d.id);}}><Trash2 size={13}/></button></div>))}</div></div>
          {hasData&&<div><div className="fmono" style={{fontSize:10.5,color:T.muted,marginBottom:8,letterSpacing:"0.08em"}}>COLUMNS <span style={{textTransform:"none",letterSpacing:0,opacity:.7}}>· tap dot to set type</span></div><div style={{display:"flex",flexDirection:"column",gap:4}}>{cols.map(c=>(<div key={c.field} style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:12,fontFamily:"IBM Plex Mono"}}><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.field}{c.overridden&&<span style={{color:T.muted,opacity:.7}}> *</span>}</span><button onClick={()=>toggleColType(c.field)} title={"Type: "+c.type+(c.overridden?" (manual)":"")+" — click to switch to "+(c.type==="numeric"?"categorical":"numeric")} style={{display:"inline-flex",alignItems:"center",gap:5,border:"none",background:"transparent",cursor:"pointer",flexShrink:0,marginLeft:8,padding:"2px 3px"}}><span style={{fontSize:9.5,color:T.muted}}>{c.type==="numeric"?"num":"cat"}</span><span style={{width:7,height:7,borderRadius:"50%",background:c.type==="numeric"?T.interval:T.point}}/></button></div>))}</div></div>}
        </aside>

        <main className="scrollbox" style={{background:T.paper,overflowY:"auto",minHeight:0}}>
          {showGallery?<TemplateGallery onPick={applyTemplate}/>
          :!hasData?<div style={{maxWidth:820,margin:"0 auto",padding:"24px 26px"}}><EmptyState onPick={()=>csvRef.current.click()} onSample={loadSample} onOpen={()=>importRef.current.click()} onConnect={()=>openConn("wb")} pending={(active.blocks||[]).length}/></div>
          :<div style={{maxWidth:820,margin:"0 auto",padding:"22px 30px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,flexWrap:"wrap"}}>
              <span className="fmono" style={{fontSize:11.5,color:T.muted,background:T.surface,border:"1px solid "+T.line,borderRadius:14,padding:"4px 12px",display:"flex",alignItems:"center",gap:7}}><Database size={13} style={{color:T.interval}}/>{active.dataset.name} · {active.dataset.rows.length}×{active.dataset.fields.length}</span>
              <button className="btn btn-sm" onClick={()=>setPaletteOpen(true)} style={{background:T.ink,color:T.paper,marginLeft:"auto"}}><Plus size={14}/>Add visualization</button>
            </div>
            {(active.blocks||[]).length===0?<div className="card" style={{padding:"36px 20px",textAlign:"center"}}><Search size={26} style={{color:T.interval,marginBottom:10}}/><h3 className="fdisplay" style={{fontSize:19,fontWeight:600,margin:"0 0 6px"}}>Empty document</h3><p style={{fontSize:14,color:T.muted,margin:"0 0 16px"}}>Search the visualizer library and drop a chart in.</p><button className="btn btn-primary btn-sm" onClick={()=>setPaletteOpen(true)}><Plus size={14}/>Add your first visualization</button></div>
              :active.blocks.map((b,bi)=>(<Block key={b.id} block={b} dataset={active.dataset} cols={cols} onConfig={p=>updateBlockConfig(b.id,p)} onRemove={()=>removeBlock(b.id)} onExplain={explain} onMove={dir=>moveBlock(b.id,dir)} canUp={bi>0} canDown={bi<active.blocks.length-1}/>))}
            {(active.blocks||[]).length>0&&<button className="btn btn-ghost btn-sm" onClick={()=>setPaletteOpen(true)} style={{width:"100%",justifyContent:"center",marginTop:4,marginBottom:30,borderStyle:"dashed"}}><Plus size={15}/>Add another visualization</button>}
          </div>}
        </main>
      </div>

      <div style={{borderTop:"1px solid "+T.line,background:T.surface,padding:"6px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,gap:12}}>
        <span className="fmono" style={{fontSize:11,color:T.muted}}>{hasData?active.dataset.rows.length+" rows × "+active.dataset.fields.length+" cols · "+(active.blocks||[]).length+" blocks":showGallery?"choose a template":"no data"}</span>
        <span style={{fontSize:11,color:T.muted,display:"flex",alignItems:"center",gap:6,minWidth:0}}><AlertTriangle size={12} style={{color:T.point,flexShrink:0}}/><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>Computed locally · descriptive, correlation, OLS (robust SE, VIF, fixed effects), ADF & linear-trend forecasting</span></span>
        <span className="fmono" style={{fontSize:11,color:saveColor,whiteSpace:"nowrap"}}>{saveLabel}</span>
      </div>

      {paletteOpen&&<SearchPalette onClose={()=>setPaletteOpen(false)} onPick={addBlock}/>}
      {transformOpen&&<TransformModal cols={cols} onClose={()=>setTransformOpen(false)} onApply={addTransform}/>}
      {connOpen&&<ConnectorsModal source={connSrc} onClose={()=>setConnOpen(false)} onImport={importExternal}/>}
      {teacher&&teacherOpen&&<TeacherPanel onClose={()=>setTeacherOpen(false)} level={level} setLevel={setLevel} docConcepts={docConcepts} hasData={hasData} messages={teacherMsgs} busy={teacherBusy} error={teacherErr} onSend={sendTeacher}/>}
    </div>
  );
}
function EmptyState({onPick,onSample,onOpen,onConnect,pending}){
  return (<div style={{textAlign:"center",padding:"54px 16px",maxWidth:480,margin:"10px auto 0"}} className="fade">
    <div style={{width:54,height:54,borderRadius:4,background:T.surface,border:"1px solid "+T.line,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",color:T.interval}}><Database size={24}/></div>
    <h3 className="fdisplay" style={{fontSize:22,fontWeight:600,margin:"0 0 8px"}}>Add data to your document</h3>
    <p style={{fontSize:14.5,color:T.muted,lineHeight:1.55,margin:"0 0 22px"}}>Upload a CSV, pull live economic data from the World Bank, or start with a sample. {pending>0?"Your "+pending+" template visualization"+(pending>1?"s":"")+" will appear as soon as data is loaded.":"Then search the library to add charts and analyses."}</p>
    <div style={{display:"flex",gap:9,justifyContent:"center",flexWrap:"wrap"}}><button className="btn btn-primary btn-sm" onClick={onPick}><Upload size={14}/>Upload CSV</button><button className="btn btn-ghost btn-sm" onClick={onConnect}><Globe size={14}/>Get external data</button><button className="btn btn-ghost btn-sm" onClick={onOpen}><FolderOpen size={14}/>Open document</button><button className="btn btn-ghost btn-sm" onClick={()=>onSample(sampleCrossSection())}>Regions sample</button><button className="btn btn-ghost btn-sm" onClick={()=>onSample(sampleTimeSeries())}>Time series</button></div>
  </div>);
}
export default function App(){
  const [view,setView]=useState("home");
  useEffect(()=>{if(view==="home")window.scrollTo(0,0);},[view]);
  return (<div className="candor"><style>{CSS}</style><style>{"@media(min-width:860px){.hero-grid{grid-template-columns:1.05fr .95fr !important;}}@media(min-width:880px){.ws-grid{grid-template-columns:224px 1fr !important;}}"}</style>{view==="home"?<Landing onLaunch={()=>setView("app")}/>:<WorkspaceApp onBack={()=>setView("home")}/>}</div>);
}
