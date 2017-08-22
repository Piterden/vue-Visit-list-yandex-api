ymaps.ready(init);
var map;

function init() {
    map = new ymaps.Map("map", {
        center: [59.939095, 30.31586],
        zoom: 9,
        behaviors: [ 'scrollZoom']
    });
   

    var suggestView = new ymaps.SuggestView('suggest', {
        offset: [5, 12],
        width: 300
    });

    var even = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    suggestView.events.add('select', function() {
        suggest.dispatchEvent(even);
    });

};




    var vm = new Vue({
        el: '#veus',
        data: {
            inputAdress: "",
            inputTitle: "",
            checked: false,
            adresses: []

        },
        methods: {
            addEle: function(title, adress, placemark) {
              console.log(placemark);
                this.adresses.push(new Place(title, adress, placemark));
            },
            addAdress: function(title, adress) {
              if (this.inputAdress == "" || this.inputTitle == "") return alert("Fill all the forms, please") ;
                var newPlacemark;
                let myGeocoder = ymaps.geocode(adress);
                var self = this;
                myGeocoder.then(
                    function(res) {
                        var coordinates = res.geoObjects.get(0).geometry.getCoordinates();
                        newPlacemark = new ymaps.Placemark(coordinates, {
                        balloonContent: '<strong>' + title + '</strong> <br>' + adress
                        });
                        map.geoObjects.add(newPlacemark);
                        map.setCenter(coordinates, 14);
                        self.addEle(title, adress, newPlacemark);
                    },
                    function(err) {
                        console.log('Ошибка');
                    }
                )
            },
            removeAdress: function(adress){
              var index=this.adresses.indexOf(adress);
              console.log(this.adresses[index])
              map.geoObjects.remove(this.adresses[index].placemark);
              this.adresses.splice(index, 1);

            },
            isVisited: function(adress){
              var index= this.adresses.indexOf(adress);
              var place = this.adresses[index];
              if(place.visited) {
                place.placemark.options.set("preset", "islands#blueIcon");
               this.adresses[index].visited = false;
              }
              else {
                place.placemark.options.set("preset", "islands#greenIcon");
                this.adresses[index].visited = true;
                 }
              },
            showPlace: function(adress) {
              var index= this.adresses.indexOf(adress);
              var placemark = this.adresses[index].placemark;
              map.setCenter(placemark.geometry.getCoordinates(), 7);
              placemark.balloon.open();
            }


        }
    })


function Place(title, adress, placemark) {
    this.title = title;
    this.adress = adress;
    this.visited = false;
    this.placemark = placemark;
}