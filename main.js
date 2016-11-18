// ==UserScript==
// @name         SoPt-Gifs
// @namespace    com.jefhtavares
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://chat.stackexchange.com/rooms/*
// @match        https://chat.stackexchange.com/rooms/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const apiKey = "dc6zaTOxFJmzC"; //Beta API Key - Use only in development
    const apiUrl = "http://api.giphy.com/v1/gifs/search";

    $.getScript("http://code.jquery.com/ui/1.12.0/jquery-ui.min.js", function(){
        $('<link/>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: 'http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css'
        }).appendTo('head');
    });

    $('#widgets').append(htmlInputs());
    $('#widgets').append(modal());

    $('body').on('click', '#bt-buscar', function () {
        if(!$('#txt-busca').val())
            return;

        var url = apiUrl + '?q=' + $('#txt-busca').val() + '&limit=6&api_key=' + apiKey;
        $.get(url, function(data){
            if(data.data){
                $('#dialog-content').html('');
            }
            data.data.forEach(function(el){
                $('#dialog-content').append(montarTagImg(el.images.original.url));
            });
            
            $('#dialog').dialog({
                position: { my: "left bottom", at: "left bottom", of: $('#widgets') } ,
                closeText: '',
                closeOnEscape: true,
                draggable: false,
                title: 'Selecionar GIF',
                modal: true
            });
        });
    });

    $('body').on('click', '.gif', function(){
        $('#input').val($(this).data('url'));
        //$('#sayit-button').trigger('click');
        $('#dialog').dialog('destroy');
    });
})();

function modal(){
    return '<div id="dialog" title="Escolha">' +
        '<div id="dialog-content"> </div>'+
        '</div>';
}

function montarTagImg(gifUrl){
    return '<img class="gif" src="' + gifUrl + '" style="width: 120px; height: 80px; cursor: pointer; margin: 3px;" data-url="'+ gifUrl + '"> </img>';
}

function htmlInputs(){
    return '<input type="text" id="txt-busca" /> <button class="button" id="bt-buscar">Buscar GIF</button>';
}

