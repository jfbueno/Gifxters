// ==UserScript==
// @name         SoPt-Gifs
// @namespace    com.jefhtavares
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://chat.stackexchange.com/rooms/*
// @match        https://chat.stackexchange.com/rooms/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };

    var offset = 0, limit = 6;
    const imgTagTpl = '<img class="gif" src="#GIF-URL#" style="width: 120px; height: 80px; cursor: pointer; margin: 3px;" data-url="#GIF-URL#"> </img>';
    const apiKey = 'dc6zaTOxFJmzC'; //Beta API Key - Use only in development
    const apiUrl = 'http://api.giphy.com/v1/gifs/search';
    const modalOptions = {
        position: { my: 'left bottom', at: 'left bottom', of: $('#widgets') } ,
        closeText: '',
        closeOnEscape: true,
        draggable: true,
        resizable: false,
        title: 'Selecionar GIF',
        modal: true
    };

    $('').css( { cursor: 'pointer' } );

    $.getScript("http://code.jquery.com/ui/1.12.0/jquery-ui.min.js", function(){
        $('<link/>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: 'http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css'
        }).appendTo('head');

        $('#widgets').append(htmlInputs());
    });

    $('.ui-widget-overlay').live('click', function(){
        $('#dialog').dialog('close');
    });

    $('body').on('click', '#bt-buscar', function () {
        if(!$('#txt-busca').val())
            return;

        offset = 0;
        var url = apiUrl + '?q=' + $('#txt-busca').val() + '&limit=6&offset=' + offset + '&api_key=' + apiKey;
        $.get(url, function(data){
            var modalSource = modalInicio();

            data.data.forEach(function(el){
                modalSource += imgTagTpl.replaceAll('#GIF-URL#', el.images.original.url);
            });

            modalSource += modalFim();

            $(modalSource).dialog(modalOptions);
        });
    });

    $('body').on('click', '#prev-page', function(){
        offset = offset > 5 ?  offset - 6 : 0;
        alterar($(this));
    });

    $('body').on('click', '#next-page', function(){
        offset += 6;
        alterar($(this));
    });

    function alterar(elemento){
        var gifs = elemento.parent().parent().find('.gif');
        var url = apiUrl + '?q=' + $('#txt-busca').val() + '&limit=6&offset=' + offset + '&api_key=' + apiKey;

        $.get(url, function(data){
            console.log(data);
            gifs.each(function(i, gif){
                $(this).data('url', data.data[i].images.original.url);
                $(this).attr('src', data.data[i].images.original.url);
            });
        });
    }

    $('body').on('click', '.gif', function(){
        $('#input').val($(this).data('url'));
        //$('#sayit-button').trigger('click');
        $('#dialog').dialog('destroy');
    });
})();

function modalFim(){
    return '</div><span>Powered by GIPHY</span><div style="float: right"><button id="prev-page" style="margin-right: 5px;">&#8592;</button><button id="next-page">&#8594;</button></div></div>';
}

function modalInicio(){
    return '<div id="dialog"> <div id="dialog-content">';
}

function htmlInputs(){
    return '<input type="text" id="txt-busca" /> <button class="button" id="bt-buscar">Buscar GIF</button>';
}

