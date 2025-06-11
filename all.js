
const photoNum = {
    'personal_uniform': 25,
    'personal_casual': 25,
    'team_uniform': 25
};
const sliderState = {
    photoIndex: 0,
    thumbLeft: 0,
    dataFile: 'personal_uniform'
};

const hoverElements = document.querySelectorAll(".hover");

hoverElements.forEach(function (element) {
    element.addEventListener("mouseover", function () {
        const aChild = this.querySelector(".a");
        const bChild = this.querySelector(".b");
        if (aChild && bChild) {
            aChild.style.display = "none";
            bChild.style.display = "inline-block";
        }
    });
    element.addEventListener("mouseout", function () {
        const aChild = this.querySelector(".a");
        const bChild = this.querySelector(".b");
        if (aChild && bChild) {
            bChild.style.display = "none";
            aChild.style.display = "inline-block";
        }
    });
});



function jsOutput_HTML(dataFile) {
    const jsOutput = document.querySelector('.js-output');
    const musicDOM = document.getElementById('audioelement');

    jsOutput.innerHTML = '';

    if(dataFile == 'personal_uniform') musicDOM.src = `../audio/001.mp3`;
    if(dataFile == 'personal_casual') musicDOM.src = `../audio/002.mp3`;
    if(dataFile == 'team_uniform') musicDOM.src = `../audio/003.mp3`;

    for (let i = 0; i < photoNum[dataFile]; i++) {
        jsOutput.innerHTML += `<li><div class="photo_thumb_border"><img src="../photos/${dataFile}/${i + 1}.jpg"></div></li>`;
    }

    refreshCardSliderState();
}

function refreshCardSliderState() {
    const thumbList = document.querySelector('.photo_thumb_list');
    const photo = document.querySelector('.photo');
    const thumbBorders = document.querySelectorAll('.photo_thumb_border');

    sliderState.photoIndex = 0;
    sliderState.thumbLeft = 0;

    thumbList.style.transform = 'translate(0, -50%)';

    thumbBorders.forEach((el, index) => {
        el.classList.remove('active');
        if (index === 0) {
            el.classList.add('active');
            photo.src = el.querySelector('img').src;
        }

        el.addEventListener('click', function () {
            sliderState.photoIndex = index;
            thumbBorders.forEach(e => e.classList.remove('active'));
            el.classList.add('active');
            photo.src = el.querySelector('img').src;
        });
    });
}

function initCardSliderEvents() {
    const dataBtns = document.querySelectorAll('[data-file]');
    const photoThumb = document.querySelector('.photo_thumb');
    const hideRadio = document.getElementById('hide');
    const showRadio = document.getElementById('show');
    const thumbList = document.querySelector('.photo_thumb_list');
    const photo = document.querySelector('.photo');
    const thumbBorders = () => document.querySelectorAll('.photo_thumb_border');
    const photoPrev = document.querySelector('.photo_content .btn_prev');
    const photoNext = document.querySelector('.photo_content .btn_next');
    const thumbPrev = document.querySelector('.photo_thumb .btn_prev');
    const thumbNext = document.querySelector('.photo_thumb .btn_next');
    const thumbWidth = document.querySelector('.photo_thumb_size').clientWidth;

    photoThumb.style.display = hideRadio.checked ? 'none' : 'block';
    hideRadio.addEventListener('change', () => photoThumb.style.display = 'none');
    showRadio.addEventListener('change', () => photoThumb.style.display = 'block');

    dataBtns.forEach(el => {
        el.addEventListener('click', function () {
            if(el.className.includes('active')) return;
            dataBtns.forEach(e => e.classList.remove('active'));
            el.classList.add('active');
            jsOutput_HTML(el.dataset['file']);
        });
    });

    photoPrev.addEventListener('click', function () {
        const borders = thumbBorders();
        const amount = borders.length - 1;
        sliderState.photoIndex = (sliderState.photoIndex === 0) ? amount : sliderState.photoIndex - 1;
        updatePhotoAndThumb(borders, thumbList, photo, thumbWidth);
    });

    photoNext.addEventListener('click', function () {
        const borders = thumbBorders();
        const amount = borders.length - 1;
        sliderState.photoIndex = (sliderState.photoIndex === amount) ? 0 : sliderState.photoIndex + 1;
        updatePhotoAndThumb(borders, thumbList, photo, thumbWidth);
    });

    thumbPrev.addEventListener('click', () => moveThumbList(1, thumbList, thumbWidth));
    thumbNext.addEventListener('click', () => moveThumbList(-1, thumbList, thumbWidth));
}

function updatePhotoAndThumb(borders, thumbList, photo, thumbWidth) {
    borders.forEach(e => e.classList.remove('active'));
    const active = borders[sliderState.photoIndex];
    active.classList.add('active');
    photo.src = active.querySelector('img').src;
    scrollThumbIntoView(active, thumbList, thumbWidth);
}

function moveThumbList(direction, thumbList, thumbWidth) {
    const thumbPhoto = document.querySelector('.photo_thumb li');
    if (!thumbPhoto) return;
    const thumbItemWidth = thumbPhoto.clientWidth;
    const moveAmount = Math.floor(thumbWidth / thumbItemWidth) * thumbItemWidth;
    const thumbTotalWidth = document.querySelector('.photo_thumb_list').clientWidth;
    const thumbEnd = thumbWidth - thumbTotalWidth;

    sliderState.thumbLeft += direction * moveAmount;
    if (sliderState.thumbLeft > 0) sliderState.thumbLeft = 0;
    if (sliderState.thumbLeft < thumbEnd) sliderState.thumbLeft = thumbEnd;

    thumbList.style.transform = `translate(${sliderState.thumbLeft}px, -50%)`;
}

function scrollThumbIntoView(target, thumbList, thumbWidth) {
    const targetLeft = target.offsetLeft;
    const targetRight = targetLeft + target.clientWidth;
    const currentLeft = -sliderState.thumbLeft;
    const currentRight = currentLeft + thumbWidth;

    if (targetLeft < currentLeft) {
        sliderState.thumbLeft = -targetLeft+2;
    } else if (targetRight > currentRight) {
        sliderState.thumbLeft = -(targetRight - thumbWidth)-3;
    }

    thumbList.style.transform = `translate(${sliderState.thumbLeft}px, -50%)`;
}

if (document.body.id === 'photos') {
    jsOutput_HTML('personal_uniform');
    initCardSliderEvents();
}