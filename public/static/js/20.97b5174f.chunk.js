(this.webpackJsonpbdesports=this.webpackJsonpbdesports||[]).push([[20],{309:function(e,t,s){"use strict";s.r(t);var a,r,c=s(3),n=s(2),i=s(16),d=s.n(i),o=s(26),l=s.n(o),p=s(1),b=s(108),m=s(4),u=s(12),j=s(90),x=s(91),h=window.screen.width<600,g=x.a.div(a||(a=Object(j.a)(["\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n"]))),O=x.a.form(r||(r=Object(j.a)(["\n  width: ",";\n  margin: 0 auto;\n  background-color: #3d3c40;\n  padding: ",";\n  padding-top: 20px;\n  padding-bottom: 30px;\n  border-radius: 5px;\n"])),h?"320px":"400px",h?"22px":"35px"),f=s(6),w=s(21),N=s(0);t.default=function(){var e=Object(b.a)(),t=e.register,s=e.handleSubmit,a=e.formState.errors,r=Object(p.useContext)(f.a),i=r.isAuth,o=r.setUserData,j=r.expireAt,x=r.setExpireAt,h=r.refreshUrl,y=r.setRefreshUrl,v=Object(p.useContext)(w.a),R=Object(m.g)(),S=Object(p.useState)(!1),k=Object(n.a)(S,2),C=k[0],E=k[1],A=Object(p.useState)(""),q=Object(n.a)(A,2),D=q[0],I=q[1];return Object(p.useEffect)((function(){i()&&(R.push("/"),y(!h))}),[R,j,i,h,y]),Object(N.jsx)(N.Fragment,{children:Object(N.jsxs)(g,{children:[v.successRegMsg&&Object(N.jsxs)("div",{className:"alert alert-success",role:"alert",children:[Object(N.jsx)("i",{className:"bi bi-check-circle fs-5 mx-2"}),"Successfully Registered ! Please login !"]}),Object(N.jsxs)(O,{onSubmit:s((function(e){E(!0),d.a.post("".concat("https://bdesports.yeasinjabed.dev","/api/auth/login"),e,{withCredentials:!0}).then((function(e){e.data&&(l.a.set("exp",e.data.exp,{expires:1}),o(e.data),v.setRefresh(!v.refresh),x(e.data.exp),E(!1),localStorage.setItem("update_id",e.data._id))})).catch((function(e){e.response&&(I(e.response.data.msg),E(!1))}))})),children:[Object(N.jsx)("h5",{className:"text-center text-white py-3",children:"Login"}),Object(N.jsxs)("div",{className:a.email?"input-group mt-2 mb-1 border border-danger":"input-group mt-2 mb-1",children:[Object(N.jsx)("span",{className:a.email||D?"input-group-text text-white bg-danger":"input-group-text",id:"basic-addon1",children:"@"}),Object(N.jsx)("input",Object(c.a)(Object(c.a)({type:"text",className:a.email||D?"form-control text-danger":"form-control form-body-input",placeholder:"Email address"},t("email",{required:"Email is required !",pattern:{value:/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,message:"Invalid email address !"}})),{},{onChange:function(e){I("")},autoFocus:!0,defaultValue:"test@gmail.com"}))]}),(a.email||D)&&Object(N.jsx)("small",{className:"text-danger",children:a.email&&a.email.message||D&&D}),Object(N.jsxs)("div",{className:a.password?"input-group mt-3 mb-1 border border-danger":"input-group mt-3 mb-1",children:[Object(N.jsx)("span",{className:a.password?"input-group-text text-white bg-danger":"input-group-text",id:"basic-addon1",children:Object(N.jsx)("i",{className:"bi bi-key"})}),Object(N.jsx)("input",Object(c.a)({type:"password",name:"password",className:"form-control form-body-input",placeholder:"password",autoComplete:"true",defaultValue:"1234"},t("password",{required:"Password is required!"})))]}),a.password&&Object(N.jsx)("small",{className:"text-danger",children:a.password.message}),Object(N.jsx)("button",{className:"btn btn-primary w-100 mt-4 form-body-btn",children:C?Object(N.jsx)("div",{className:"spinner-border spinner-border-sm text-white",role:"status"}):"Login"}),Object(N.jsx)("div",{className:"label-text w-100 text-center pt-4",children:Object(N.jsxs)("small",{className:"text-white",children:["Don't have an account ?",Object(N.jsx)(u.b,{to:"register",className:"mx-1 color-primary",children:"Register here"})]})})]}),Object(N.jsx)("div",{className:"w-100 text-center mt-4",children:Object(N.jsxs)("small",{className:"text-white",children:["JOIN OUR DISCORD \xa0",Object(N.jsx)("a",{href:"https://discord.gg/83QYyu3Vyk",target:"_blank",rel:"noreferrer",className:"color-primary",children:"SERVER"})]})})]})})}}}]);