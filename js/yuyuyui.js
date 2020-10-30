const siteURL = location.href;

let loading = false;

document.getElementById('GenerateForm')
    .addEventListener('submit', function (ev) {
        ev.preventDefault();

        const character = $("#CharacterSelect").val().trim();
        if (!loading) {
            loading = true;
            startSpinner();
            sendRequest({"character":character});
        }
    });



function sendRequest(request) {
    $.ajax({type: "post",
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(request),
            url: 'https://asia-northeast2-yuyuyui-script-search-20200915.cloudfunctions.net/generate-words'})
    .done(function(response) {
        try {
            fillResultBlocks(response);
        } catch (error) {
            alert("応答の処理中にエラーが発生しました。");
        }
    })
    .fail(function(jqXHR, textStatus) {
        if (jqXHR.status == 400) {
            alert("不正なリクエストが渡されました。");
        }
    })
    .always(function() {
        loading = false;
        stopSpinner();
    })

}

function fillResultBlocks(response) {
    const character = response[0];
    const text      = response[1];
    const teweetText = character + "「" + text + "」\n";
    const tweetHref = "https://twitter.com/intent/tweet?original_referer=" + encodeURI(siteURL)
        + "&ref_src=twsrc%5Etfw&text=" + encodeURI(teweetText) + "&tw_p=tweetbutton&url=" + encodeURI(siteURL);

    let template = $("#ResultTemplate").clone().attr('id', null).attr('style', null);
    template.find(".result-character")[0].textContent = character;
    template.find(".result-text")[0]     .textContent = text;
    template.find(".tweet-button-a")[0]  .href        = tweetHref;
    template.prependTo("#ResultContainer")
}

function startSpinner() {
    $('#GenerateButtonText').css("display", "none");
    $('#GenerateButtonSpinner').css("display", "block");
}

function stopSpinner() {
    $('#GenerateButtonText').css("display", "block");
    $('#GenerateButtonSpinner').css("display", "none");
}