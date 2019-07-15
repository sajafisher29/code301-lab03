'use strict'

//Create helper funtion to launch actions when the app is started

function startApp(){
  readFile();
}

//Constructor function to create objects with the JSON data

ImageObject.list = []

function ImageObject (item){
  this.image_url = item.image_url;
  this.title = item.title;
  this.description = item.description;
  this.keyword = item.keyword;
  this.horns = item.horns;
}

//Create function to read the file, run them through the constructor function, and into the storage array

function readFile(){

  $.get('/data/page-1.json', 'json')
    .then( data => {
      data.forEach(item => {
        ImageObject.list.push(new ImageObject(item));
      })

      displayImages();
      ImageObject.populateFilter();
      attachEventListeners();
    });
}

//Create function to display images on the home page by cloning the template for each photo object

function displayImages(){
  ImageObject.list.forEach( item => {
    const $newItem = $('.photo-template').clone();

    $newItem.find('h2').text(item.title);
    $newItem.find('img').attr('src', item.image_url).attr('alt', item.keyword);
    $newItem.find('p').text(item.description);
    $newItem.attr('class', item.keyword);
    $newItem.removeClass('photo-template');
    $('main').append($newItem);
  });

  //Remove the photo template now that we have data to add to the page

  $('.photo-template').remove();
}

//Read the keyword array and fill the drop down menu with those items

ImageObject.populateFilter = () => {
  const keywordArray = [];

  $('option').not(':first').remove();

  ImageObject.list.forEach ( item => {
    if(!keywordArray.includes(item.keyword)) {keywordArray.push(item.keyword);}
  })

  keywordArray.sort();

  keywordArray.forEach(keyword => {
    let $newKey = `<option value = "${keyword}">${keyword}</option>`;
    $('select').append($newKey);
  })
}

function attachEventListeners() {
  $('select').on('change', (event) => {
    const $menuChoice = $(event.target);
    const value = $menuChoice.val();

    if (value === 'default') {$('section').show();}
    else {$('section').each( function() {
      const $section = $(this);
      let text = $section.attr('class');
      if(text === value) {$section.show();}
      else {$section.hide();}
    })}
  })
}

$(startApp);
