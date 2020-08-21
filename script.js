var article;
const loader = `<div class="card mx-5 my-2  rounded d-flex justify-content-center align-items-center bg-light loader gradient"><div class="m-3 spinner-border text-success" role="status"><span class="sr-only">Loading...</span></div>Loading...</div>`;
$(document).ready(function () {

    $('.navbar-toggler').click(function (e) {
        $('.nav-mob-overly').fadeToggle(400);
        $('#navbararea').toggleClass('show');
        $('.navbar-toggler i').toggleClass('fa-bars fa-times');
        return false;
    });
    $(document).click(function (e) {
        let navToggle = $(".navbar-toggler");
        if (!navToggle.is(e.target) && navToggle.has(e.target).length === 0) {
            if ($('#navbararea').hasClass('show')) {
                $('#navbararea').removeClass('show');
                $('.nav-mob-overly').fadeOut(400);
                $('.navbar-toggler i').toggleClass('fa-bars fa-times');

            }
        }
    });
    window.addEventListener('online', function () {
        if ($('#article-area').children('article').size() == 0) {
            startup();
        }
        return false;
    });
    startup();
    return false;
});
function startup() {
    article = new wikipedia();
    article.GetArticle('14533', 'pageids');
    $(".navbar-brand").click(function (event) {
        event.preventDefault();
        if (!$('#article').hasClass('active')) {
            $('section.active').removeClass('active');
            $('#article').addClass('active');
        }
        $('#article-area').append(loader);
        article.GetArticle('5043734', 'pageids', elem = $('.nav-link:contains(home)'));
    });
    $('.nav-link-direct').click(function (e) {
        let elem;
        e.preventDefault();
        $('.nav-item.active').removeClass('active');
        $(this).closest('.nav-item').addClass('active');
        switch (this.innerText.toLowerCase()) {
            case 'about':
            case 'about':
                if (!$('#about').hasClass('active')) {
                    $('section.active').removeClass('active');
                    $('#about').addClass('active');
                }
                break;
            default:
                if (!$('#article').hasClass('active')) {
                    $('section.active').removeClass('active');
                    $('#article').addClass('active');
                }
        }
    });
    $('.back-home').click(function () {
        $('.nav-item.active').removeClass('active');
        $('.nav-link:contains(home)').closest('.nav-item').addClass('active');
        if (!$('#article').hasClass('active')) {
            $('section.active').removeClass('active');
            $('#article').addClass('active');
        }
    });
    $('a.data-link').click(function (e) {
        e.preventDefault();
        let quarry = $(this).attr('href').trim().toLowerCase().replace('https://en.wikipedia.org/wiki?curid=', '');
        if (quarry) {
            article.GetArticle(quarry, 'pageids', elem = this);
        } else {
            Swal.fire({
                icon: 'error',
                title: "Invalid link",
                text: `Sorry, this link is invalid so we are not able to complete this request.`,
                footer: `<span>Developed by : <a target="_blank" class="me" href="https://www.sololearn.com/Profile/8384697">Dheeraj Sharma</a></span>`
            });
        }
    });

    $('#quarry').keypress(function () {
        let val = this.value.toLowerCase().trim();
        try {
            $(this).autocomplete("enable");
        } catch (error) {

        }
        if (val !== undefined && val.length !== 1 && article.suggestion.key.length !== 0) {
            $(this).data("uiAutocomplete").search(val);
        }
        if (article.suggestion.status) {
            article.suggestion.status = false;
            if (val != null && val.length !== 0) {
                article.getSuggestion(this, val);
            }
        } else if (val.length !== 0) {
            article.getSuggestion(this, val);
        }
        return true;
    });
    $("form.form").submit(function (e) {
        e.preventDefault();
        let elem = '#quarry';
        let val = $(elem).val().toString().toLowerCase();
        if (val) {
            if (article.suggestion.key.indexOf(val) == -1) {
                article.GetArticle(value = val, type = 'titles', elem = $('.nav-link:contains(home)'));
            } else {
                let index = article.suggestion.key.indexOf(val);
                article.GetArticle(value = article.suggestion.value[index], type = 'pageids', elem = $('.nav-link:contains(home)'));
            }
        }
    });
    $(document).on('click', '.me', function (e) {
        if(!($('#about').find('h3').text()=='Dheeraj Sharma')){
            $('#about').empty();
            $('#about').append(`<div class=" d-flex flex-column align-items-center p-4"><img src="https://api.sololearn.com/Uploads/Avatars/8384697.jpg" alt="Dheeraj Sharma" class="img-fluid rounded"><div class="text-center px-3 py-2"><h3>Dheeraj Sharma</h3><div class="social-links m-3 text-center"><a href="https://www.sololearn.com/Profile/8384697" target="_blank"><img src="https://www.sololearn.com//Images/favicon-192x192.png" alt="sololearn"></a><a href="https://github.com/GreatNerve" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Font_Awesome_5_brands_github.svg" alt="github"></a><a href="https://stackoverflow.com/users/13444609/dheeraj-sharma" target="_blank"><img src="https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png" alt="github"></a></div><h6 class="mx-3 text-break">This project is devloped by me for just fun.</h6><button class="btn btn-outline-primary mt-2 back-home">Back to home</button></div></div><hr>`);
        }
        e.preventDefault();
        Swal.close();
        $('.nav-item.active').removeClass('active');
        $('.nav-link:contains(about)').closest('.nav-item').addClass('active');

        if (!$('#about').hasClass('active')) {
            $('section.active').removeClass('active');
            $('#about').addClass('active');
        }
    });
    $(window).scroll(function () {
        let scrollTop = $(this).scrollTop();
        if (scrollTop > 20) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
        return false;
    });

    $('.back-to-top').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 1000, 'swing');
        return false;
    });
}
class wikipedia {
    constructor(target = '#article-area', apiURL = 'https://en.wikipedia.org/w/api.php') {
        this.apiURL = apiURL;
        this.target = target;
        this.article;
        this.suggestion = {
            key: Array(),
            value: Array(),
            status: true
        };
    }
    getSuggestion(elem, value) {
        let dataSend = {
            gsrsearch: value.trim().toLowerCase(),
            action: 'query',
            generator: 'search',
            utf8: 1,
            format: 'json'
        };
        let cls = this;
        jQuery.ajax({
            url: this.apiURL,
            type: 'get',
            data: dataSend,
            dataType: 'jsonp',
            timeout: 5000,
            crossDomain: true,
            async: true,
            success: function (responce, status, xhr) {
                if (status == 'success') {
                    try {
                        if (responce.query != undefined) {
                            let sortArray = Array();
                            for (let pg in responce.query.pages) {
                                sortArray.push(responce.query.pages[pg]);
                            }
                            sortArray.sort(function (el1, el2) {
                                return el1.index - el2.index;
                            });
                            for (let pg in sortArray) {
                                cls.suggestion.key.push(sortArray[pg].title.toLowerCase());
                                cls.suggestion.value.push(sortArray[pg].pageid);
                            }
                            cls.suggestion.status = true;
                            $(elem).autocomplete({
                                source: Array(...new Set(cls.suggestion.key))
                            });
                            $(elem).data("uiAutocomplete").search(value);
                            return true;
                        }
                    } catch (error) {

                    }
                }
            }
        });
    }
    GetArticle(value = 'Curiosity rover', type = 'titles', elem) {
        $(this.target).children('.loader').remove();
        $(this.target).children().hide();
        $(this.target).prepend(loader);
        let dataSend = {
            [type]: value.toString().trim().toLowerCase(),
            action: 'query',
            format: 'json',
            redirects: 1,
            prop: 'extracts',
            exintro: '',
            explaintext: ''
        };
        let cls = this;
        jQuery.ajax({
            url: this.apiURL,
            type: 'get',
            data: dataSend,
            dataType: 'jsonp',
            timeout: 5000,
            crossDomain: true,
            async: true,
            success: function (responce, status, xhr) {
                if (status == 'success') {
                    cls.article = responce;
                    for (let pg in cls.article.query.pages) {
                        if (pg != undefined && pg != '-1') {
                            let dataImgSend = {
                                pageids: pg,
                                action: 'query',
                                format: 'json',
                                redirects: 1,
                                prop: 'pageimages',
                                piprop: 'original'
                            };
                            jQuery.ajax({
                                url: cls.apiURL,
                                type: 'get',
                                data: dataImgSend,
                                dataType: 'jsonp',
                                timeout: 5000,
                                crossDomain: true,
                                async: true,
                                success: function (responce, status, xhr) {
                                    if (status == 'success') {
                                        $(cls.target).empty();
                                        $(cls.target).prepend(loader);
                                        try {
                                            cls.article.query.pages[pg].img = responce.query.pages[pg].original.source != undefined ? responce.query.pages[pg].original.source : '';
                                            cls.setArticle(pg, cls.target);
                                        } catch (error) {
                                            cls.article.query.pages[pg].img = '';
                                            cls.setArticle(pg, cls.target);
                                        }
                                    }
                                    return false;
                                },
                                error: function (xhr, status, error) {
                                    cls.article.query.pages[pg].img = '';
                                    cls.setArticle(pg, cls.target);
                                    return false;
                                }
                            });
                        } else {
                            $(cls.target).children().show();
                            if ($(cls.target).children('article').size()) {
                                $(cls.target).children('.loader').remove();
                            }
                            Swal.fire({
                                icon: 'error',
                                title: "No article found",
                                text: `Sorry, We didn't found any article related on subject ${value}.`,
                        footer: `<span>Developed by : <a target="_blank" class="me" href="https://www.sololearn.com/Profile/8384697">Dheeraj Sharma</a></span>`
                            });
                            return false;
                        }
                    }
                    if (elem) {
                        $('.nav-item.active').removeClass('active');
                        $(elem).closest('.nav-item').addClass('active');
                        if (!$('#article').hasClass('active')) {
                            $('section.active').removeClass('active');
                            $('#article').addClass('active');
                        }
                    }
                }
                return false;
            }, error: function (xhr, status, error) {
                $(cls.target).children().show();
                if ($(cls.target).children('article').size() > 0) {
                    $(cls.target).children('.loader').remove();
                }
                if (error == "") {
                    Swal.fire({
                        icon: 'warning',
                        title: "No Internet",
                        html: `<div align="left">Try :<blockquote><small><ul><li>Checking the network cables, modem, and router</li><li>Reconnecting to Wi-Fi</li></ul></small></blockquote></div>`,
                        footer: `<span>Developed by : <a target="_blank" class="me" href="https://www.sololearn.com/Profile/8384697">Dheeraj Sharma</a></span>`
                    });

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: error.toUpperCase(),
                        text: `Sorry, we are not able to complete this request.`,
                        footer: `<span>Developed by : <a target="_blank" class="me" href="https://www.sololearn.com/Profile/8384697">Dheeraj Sharma</a></span>`
                    });
                }
                return false;
            }
        });
    }
    setArticle(pg, target) {
        if (pg &&
            target &&
            this.article &&
            this.article.query.pages &&
            this.article.query.pages[pg]) {
            $('#quarry').blur();
            let elem = $(`<article></article>`);
            let div = $('<div></div>');
            let footer = $('<div></div>').attr({ align: 'center' });
            elem.attr({ class: 'container-fluid px-4 mb-1' });
            div.attr({ class: "clearfix" });
            if (this.article.query.pages[pg].img) {
                let aimg = $('<a></a>').attr({
                    class: 'venobox',
                    href: this.article.query.pages[pg].img,
                    'data-title': this.article.query.pages[pg].title
                });
                aimg.append($('<img>').attr({
                    class: 'mx-3 articleImg',
                    src: this.article.query.pages[pg].img
                }));
                div.append(aimg);
            }
            div.append($('<p></p>').text(this.article.query.pages[pg].extract));
            footer.append($('<a></a>').attr({
                class: 'btn btn-outline-info w-auto',
                href: `https://en.wikipedia.org/wiki?curid=${pg}`,
                target: '_blank'
            }).text('Full article'));
            footer.append($('<hr>'));

            elem.append($('<h3></h3>').text(this.article.query.pages[pg].title));
            elem.append($('<hr>').attr({ class: 'my-2' }));
            elem.append(div);
            elem.append(footer);
            elem.hide();
            $(target).append(elem);
            $(this.target).children('.loader').fadeOut(200, function () {
                $(this).remove();
            });
            elem.fadeIn(2200);
            $('.venobox').venobox({ spinner: 'three-bounce', titleattr: 'data-title', share: ['facebook', 'twitter', 'linkedin', 'pinterest', 'download'] });
            return false;

        }
    }
}