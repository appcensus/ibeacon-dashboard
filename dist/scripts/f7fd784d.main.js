function loadData(){x=[x[0]],minutes=[minutes[0]];for(var a=0;PERIOD>a;a++){minutes.push(Math.floor(100*Math.random()));var b=new Date;b.setDate(b.getDate()+(a-PERIOD));var c=b.getFullYear()+"-"+b.getMonth()+"-"+b.getDate();x.push(c)}}function update(){loadData(),chart.load({columns:[x,minutes]})}var x=["x"],minutes=["Minutes"],PERIOD=7,chart;$(function(){setTimeout(function(){$(".loading-spinner").hide(),$(".main").show(),$("#period").on("change",function(){var a=$(this).val();a!==PERIOD&&(PERIOD=$(this).val(),update())}),loadData(),chart=c3.generate({data:{x:"x",type:"bar",columns:[x,minutes]},axis:{x:{type:"timeseries",tick:{format:"%Y-%m-%d"}}}})},2e3)});