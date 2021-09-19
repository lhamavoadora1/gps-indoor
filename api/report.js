const express = require('express');
var pdf = require('html-pdf');
var ejs = require('ejs');

var d = new Date(Date.now());
var datetime = d.toLocaleString();

ejs.renderFile("./template/reportTemplate.ejs",{datetime:datetime}, (err,html) =>{

    if(err){
        console.log("erro");
    }
    else{
        pdf.create(html,{}).toFile("./relatorio.pdf",(err,res) =>{
            if(err){
                console.log("deu ruim");
            }
            else{
                console.log(res);
            }
        })

    }
});
