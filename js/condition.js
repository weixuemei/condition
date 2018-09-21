/**
 *配置表达式
 *
 * paramList 的数据结构  [{'paramId':'','paramName':''},{'paramId':'','paramName':''}]
 * paramId  ---- 参数唯一标识   paramName --- 参数名
 * eg:[{'paramId':'cifName','paramName':'客户号'},{'paramId':'cifLvl','paramName':'客户等级'}]
 * symbolList 的数据结构 [{'symbolId':'','symbolName':''},{'symbolId':'','symbolName':''}]
 * symbolId ----  符号唯一标识    symbolName ---- 符号名
 * eg:[{'symbolId':'==','symbolName':'等于'},{'symbolId':'<=','symbolName':'小于等于'}]
 *
 *
 */
//参数列表
var paramList = new Array();
var paramDefList = [{'paramId':'AMT','paramName':'消费金额'},{'paramId':'CIF_LVL','paramName':'客户号'},
    {'paramId':'REG_TIME','paramName':'注册时间'}];
//参数
var select_cond_1='';
//符号参数列表
var symbolList = new Array();
var symbolDefList = [{'symbolId':'>','symbolName':'大于'},{'symbolId':'<','symbolName':'小于'},
    {'symbolId':'==','symbolName':'等于'}]
//符号参数
var select_cond_2='';
var exp = '';
var info = '';
$(function(){
    initselect_cond(null,null);
    addCond("condition");
    $("#btnOk").click(function(){
        exp = doaddCondition("table");
        $("#expr").html(exp);
    });

    $("#btnShow").click(function(){
       var html = createTableHtml(exp,"e_condition_table","e_condition");
        $("#edit_condition").html(html);
    })
});

/**
 * 初始化下拉列表
 * @param paramList
 * @param symbolList
 */
function initselect_cond(paramList,symbolList){
    if(paramList==null||paramList.length<=0){
        paramList = paramDefList;
    }
    select_cond_1 = '<select name="select1"><option>--请选择参数--</option>';
    for(var i=0;i<paramList.length;i++){
        select_cond_1+='<option value="'+paramList[i].paramId+'">'+paramList[i].paramName+'</option>';
    }
    select_cond_1+='</select>';
    if(symbolList==null||symbolList.length<=0){
        symbolList = symbolDefList;
    }
    select_cond_2 = '<select name="select2"><option>--请选择操作符--</option>';
    for(var i=0;i<symbolList.length;i++){
        select_cond_2+='<option value="'+symbolList[i].symbolId+'">'+symbolList[i].symbolName+'</option>';
    }
    select_cond_2+='</select>';
}

/**
 * 获取下一个div的标识
 * @param parentId  父级div的ID
 * @returns {Object}
 */
function getNextId(parentId){
    var next_ids = new Object();
    var first_child_id = $("#"+parentId+" :first-child").attr("id");
    if(first_child_id==undefined){
        next_ids.id = parentId+"_1";
        next_ids.table = parentId+"_table_1";
        next_ids.span = parentId+"_span_1";
    }else{
        var now_html_length = $("#"+parentId).children().length;
        var before_id = first_child_id;
        var next_id = first_child_id;
        for(var i=0;i<now_html_length-1;i++){
            next_id = $("#"+before_id).next().attr("id");
            before_id = next_id;
        }
        next_id =parentId+"_"+(parseInt(next_id.substring(next_id.length-1))+1);
        next_ids.id = next_id;
        next_ids.table = parentId+"_table_"+next_id;
        next_ids.span = parentId+"_span_"+next_id;
    }
    return next_ids;
}

/**
 * 添加条件
 * @param parentId 父级div的ID
 */
function addCond(parentId){
    var id=getNextId(parentId).id;
    var html='<div id="'+id+'" class="am-form am-form-inline bottom-in">' +
        '<div class="am-form-group cond1-select">' +select_cond_1+
        '</div>' +
        '<div class="am-form-group cond2-select">' +select_cond_2+
        '</div>' +
        '<div class="am-form-group cond1-select" >' +
        '<input name="text1" type="text"></div>' +
        '<div class="am-form-group">' +
        '<span class="am-icon-close" style="color: red" onclick="removeCond(\''+id+'\')"></span></div>' +
        '</div>';
    $("#"+parentId).append(html);
}

/**
 * 添加条件组
 * @param parentId
 */
function addConds(parentId){
    var id=getNextId(parentId).id;
    var tableid=getNextId(parentId).table;
    var spanid =getNextId(parentId).span;
    var html = '<table id="'+tableid+'" class="am-table am-table-bordered" style="height: 60px;">' +
        '<tr>' +
        '<td width="5%" id="'+spanid+'" style="vertical-align: middle">\n' +
        '<span class="show-cond-word" onclick="changeCond(\''+spanid+'\',\'1\')" name="word1">且</span>\n' +
        '<span class="hidden-cond-word" onclick="changeCond(\''+spanid+'\',\'2\')" name="word2">或</span>\n' +
        '</td>\n' +
        '<td width="90%" id="'+id+'">\n' + getConditionHtml(id,1) + getConditionHtml(id,2)+
        '</td>\n' +
        '<td width="5%">\n' +
        '<span class="am-icon-trash" style="color: red;" onclick="removeCond(\''+tableid+'\')" title="移除条件组"></span><br/>\n' +
        '<span class="am-icon-plus" onclick="addCond(\''+id+'\')" title="添加条件"></span><br/>\n' +
        '<span class="am-icon-plus-circle" onclick="addConds(\''+id+'\')" title="添加条件组"></span>\n' +
        '</td>' +
        '</tr>' +
        '</table>';
    $("#"+parentId).append(html);
    //添加基础配置
}

/**
 * 修改条件  且/或转换
 * @param id
 * @param item
 */
function changeCond(id,item){
    id = "#"+id;
    var word = '&&';
    if(item=='1'){
        word='||';
        $(id+' span[name="word1"]').attr("class","hidden-cond-word");
        $(id+' span[name="word2"]').attr("class","show-cond-word");
    }else{
        word='&&';
        $(id+' span[name="word2"]').attr("class","hidden-cond-word");
        $(id+' span[name="word1"]').attr("class","show-cond-word");
    }
}

/**
 * 移除DIV块
 * @param item
 */
function removeCond(item){
    $("#"+item).remove();
}

/**
 * 添加子条件的一行代码
 * @param id
 * @param i
 * @returns {string}
 */
function getConditionHtml(id,i){
    var condid = id+"_"+i;
    var html = '<div id="'+condid+'" class="am-form am-form-inline bottom-in">' +
        '<div class="am-form-group cond1-select">' + select_cond_1+
        '</div>' +
        '<div class="am-form-group cond2-select">' + select_cond_2+
        '</div>' +
        '<div class="am-form-group cond1-select">' +
        '<input type="text" name="text1">' +
        '</div>';
    var html1='</div>';
    if(i>0){
        html1 =  '<div class="am-form-group">' +
            '<span class="am-icon-close" style="color: red" onclick="removeCond(\''+condid+'\')"></span>' +
            '</div>' +
            '</div>';
    }
    html = html+html1;
    return html;
}

/**
 * 进行回调拼接
 * @param tableId
 * @returns {*}
 */
function doaddCondition(tableId){
    var expression = '';
    var spanId =  $("#"+tableId+" td:first-child").attr("id");
    var word = $("#"+spanId+" span[class=\'show-cond-word\']").attr("name");
    var symbol = "and";
    if(word=='word1'){
        symbol = 'and';
    }else if(word='word2'){
        symbol = "or";
    }
    var condition_id = $("#"+spanId).next().attr("id");
    var condition_lenght = $("#"+condition_id).children().length;
    var cond_before_child = $("#"+condition_id+" :first-child").attr("id");
    console.log("先处理该div下的第一个代码块");
    if(checkTable(cond_before_child)){
        console.log("这个块是table块");
        expression ="("+doaddCondition(cond_before_child)+")";
    }else{
        console.log("这是个div块");
        var select1 = $("#"+cond_before_child+" select[name=\'select1\']").val();
        var select2 = $("#"+cond_before_child+" select[name=\'select2\']").val();
        var text =  $("#"+cond_before_child+" input[name=\'text1\']").val();
        if(checkInfo(select1)&&checkInfo(select2)&&checkInfo(text)){
            expression =select1+select2+"'"+text+"'";
        }else{
            return false;
        }
    }
    var cond_next_child = cond_before_child;
    for(var i=0;i<condition_lenght-1;i++){
        cond_next_child = $("#"+cond_before_child).next().attr("id");
        if(checkTable(cond_next_child)){
            console.log("这个块是table块");
            expression+=symbol+"("+doaddCondition(cond_next_child)+")";
        }else{
            console.log("这是个div块");
            var select1 = $("#"+cond_next_child+" select[name=\'select1\']").val();
            var select2 = $("#"+cond_next_child+" select[name=\'select2\']").val();
            var text =  $("#"+cond_next_child+" input[name=\'text1\']").val();
            expression += symbol+select1+select2+"'"+text+"'";
        }
        cond_before_child = cond_next_child;
    }
    return expression;
}

//检测规则框中参数是否传入
function checkInfo(name){
    if(name==''||name==undefined){
        $.infoErrDialog("规则配置错误，请检查是否有空的条件规则");
        return false;
    }
    return true;
}

//判断是不是table块
function checkTable(tableId){
    if(tableId.indexOf("table")>0){
        return true;
    }
    return false;
}

/**
 * **************************************分割线 触发条件回显操作***************************************
 */

/**
 * 解析规则。
 * @param expression
 * @returns {Object}
 */
function anlyExpression(expression){
    console.log("要解析的规则是"+expression);
    var ruleExpList = new Object();
    var bracketList = new Array();  //所有括号集合
    for(var i=0;i<expression.length;i++){
        if(expression[i]=='('||expression[i]==')'){
            var bracket = new Object();
            bracket.exp = expression[i];
            bracket.index = i;
            bracketList.push(bracket);
        }
    }
    console.log(JSON.stringify(bracketList));
    var locaList = new Array();   //一级括号开始结束位置集合
    if(bracketList.length>0){
        var beforeVal = bracketList[0].exp;
        var beforeNum =bracketList[0].index;
        var symLength = '1';   //标志括号功能，左括号+1，右括号-1，该参数为0时表示括号闭合
        for(var j=1;j<bracketList.length;j++){
            var nowVal = bracketList[j].exp;
            var nowNum = bracketList[j].index;
            if(nowVal=="("){
                symLength++;
            }else if(nowVal==')'){
                symLength--;
            }
            if(symLength==0){
                var c = new Object();
                c.beginIndex = beforeNum;
                c.endIndex = nowNum;
                locaList.push(c);
                if((j+1)<bracketList.length){
                    beforeVal = bracketList[j+1].exp;
                    beforeNum = bracketList[j+1].index;
                }
            }
        }
    }
    console.log(JSON.stringify(locaList));
    var braketExpList = new Array();
    var lastExpre = expression;
    if(locaList!=null&&locaList.length>0){
        for(var k=(locaList.length-1);k>=0;k--){
            var express = expression;
            var braketExp = new Object();
            braketExp.exp = express.substring(locaList[k].beginIndex+1,locaList[k].endIndex);
            lastExpre = lastExpre.substring(0,locaList[k].beginIndex+1)+lastExpre.substring(locaList[k].endIndex,lastExpre.length);
            braketExpList.push(braketExp);
        }
    }
    console.log("表达式中在大括号里面的表达式列表"+JSON.stringify(braketExpList));
    console.log("去除括号里面内容的表达式"+JSON.stringify(lastExpre));
    console.log("最开始的表达式"+JSON.stringify(expression));
    var symbolitem = 'and';
    var expArray = lastExpre.split('and');
    if(expArray.length==1){
        symbolitem = 'or';
        expArray = lastExpre.split('or');
    }
    var expItemList = new Array();
    var sr = 1;
    for(var t=0;t<expArray.length;t++){
        var expItem = new Object();
        var s = expArray[t];
        if(s!='()'){
            var matchSym = inMatchSymbol(s);
            var slength = s.indexOf(matchSym);
            expItem.flag='expinfo';
            expItem.select1 = s.substring(0,slength);
            expItem.select2=matchSym.replace("&gt;",">").replace("&lt;","<");
            expItem.text1=s.substring((slength+matchSym.length+1),s.length-1);
        }else{
            expItem.flag='expList';
            var si = braketExpList.length-sr;
            expItem.list= braketExpList[si].exp;
            sr++;
        }
        expItemList.push(expItem);
    }
    ruleExpList.symbol = symbolitem;   //符号
    ruleExpList.expList = expItemList;     //表达式列表
    console.log("解析后的规则是"+JSON.stringify(ruleExpList));
    return ruleExpList;
}

function inMatchSymbol(exp){
    var symbolList = ["&gt;=",">=","&lt;=","<=","&gt;","lt;",">","<","=="];
    for(var i=0;i<symbolList.length;i++){
        if(exp.indexOf(symbolList[i])>-1){
            return symbolList[i];
        }
    }
}

//创建table块，将table块中的div信息回显
function createTableHtml(expres,tableId,divId){
    var ruleExpList = anlyExpression(expres);
    var symbol = ruleExpList.symbol;
    var spanId = tableId+"_span";
    var html = '<table id="'+tableId+'" class="am-table am-table-bordered" style="height: 60px;">' +
        '<tr>' +getSpanHtml(spanId,symbol)+
        '<td width="90%" id="'+divId+'">' + getDivHtml(ruleExpList,divId)+
        '</td>' +
        '<td width="5%">' +
        '<span class="am-icon-trash" style="color: red;" onclick="removeCond(\''+tableId+'\')" title="移除条件组"></span><br/>\n' +
        '<span class="am-icon-plus" onclick="addCond(\''+divId+'\')" title="添加条件"></span><br/>' +
        '<span class="am-icon-plus-circle" onclick="addConds(\''+divId+'\')" title="添加条件组"></span>' +
        '</td>' +
        '</tr>' +
        '</table>';
    return html;
}

//创建下拉框HTML 并进行值的回显
function getSelectHtml(type,val){
    var html = '';
    if(type=='select1'){
        if(paramList==null||paramList.length<=0){
            paramList = paramDefList;
        }
        html='<select name="select1"><option value=""></option>';
        for(var i=0;i<paramList.length;i++){
            if(paramList[i].paramId==val){
                html += '<option value="'+paramList[i].paramId+'" selected="selected">'+paramList[i].paramName+'</option>';
            }else{
                html += '<option value="'+paramList[i].paramId+'">'+paramList[i].paramName+'</option>';
            }
        }
        html += '</select>';
    }else if(type=='select2'){
        if(symbolList==null||symbolList.length<=0){
            symbolList = symbolDefList;
        }
        html='<select name="select2"><option value=""></option>';
        for(var i=0;i<symbolList.length;i++){
            if(symbolList[i].symbolId==val){
                html += '<option value="'+symbolList[i].symbolId+'" selected="selected">'+symbolList[i].symbolName+'</option>';
            }else{
                html += '<option value="'+symbolList[i].symbolId+'">'+symbolList[i].symbolName+'</option>';
            }
        }
        html += '</select>';
    }else if(type=='text1'){
        html = '<input name="text1" type="text"  value="'+val+'"/>' ;
    }
    return html;
}

//创建 并/且 条件HTML 并回显
function getSpanHtml(spanId,symbol){
    var html = '';
    if(symbol=='and'){
        html= '<td width="5%" style="vertical-align: middle" id="'+spanId+'">' +
            '<span class="show-cond-word" onclick="changeCond(\''+spanId+'\',\'1\')" name="word1">且</span>\n' +
            '<span class="hidden-cond-word" onclick="changeCond(\''+spanId+'\',\'2\')" name="word2">或</span>\n' +
            '</td>';
    }else if(symbol=='or'){
        html= '<td width="5%" style="vertical-align: middle" id="'+spanId+'">' +
            '<span class="hidden-cond-word" onclick="changeCond(\''+spanId+'\',\'1\')" name="word1">且</span>\n' +
            '<span class="show-cond-word" onclick="changeCond(\''+spanId+'\',\'2\')" name="word2">或</span>\n' +
            '</td>';
    }
    return html;
}

//创建 一个条件
function getDivHtml(ruleExpList,parentId){
    var expList = ruleExpList.expList;
    var html='';
    for(var i=0;i<expList.length;i++){
        var divId =parentId+"_"+(i+1);
        var tableId =parentId+"_table"+(i+1);
        var flag = expList[i].flag;
        if(flag=='expinfo'){
            html += '<div id="'+divId+'" class="am-form am-form-inline bottom-in">' +
                '<div class="am-form-group cond1-select">' + getSelectHtml('select1',expList[i].select1)+
                '</div>' +
                '<div class="am-form-group cond2-select" >' + getSelectHtml('select2',expList[i].select2)+
                '</div>' +
                '<div class="am-form-group cond1-select">' + getSelectHtml('text1',expList[i].text1)+
                '</div>' +
                '<div class="am-form-group">' +
                '<span class="am-icon-close" style="color: red" onclick="removeCond(\''+divId+'\')"></span>' +
                '</div>' +
                '</div>';
        }else if(flag=='expList'){
            html+=createTableHtml(expList[i].list,tableId,divId);
        }
    }
    return html;
}









