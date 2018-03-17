import {Component, ViewChild} from '@angular/core';
import {Content} from 'ionic-angular';
import { NavController, AlertController } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';

import { AddEventPage } from '../add-event/add-event';

import {DatabaseProvider} from "../../providers/database/database";

import {  NativeTransitionOptions } from '@ionic-native/native-page-transitions';




@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content)
  content:Content;

  items = [];

  date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  weekDayNames: string[];
  weekDayNamesDefault: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;

  eventList: any;
  selectedEvent: any;
  isSelected: any;

  // persona = {
  //   name: "Javier",
  //   yearsOfExperience: 4,
  //   skill: "Awesomness"
  // };
  developers = [];
  developer = {};

  loaded:   boolean = false;
  tabIndex: number  = 0;



  constructor(private alertCtrl: AlertController,
              public navCtrl: NavController,
              private calendar: Calendar,
              private databaseProvider: DatabaseProvider,

                                                                      ) {
    this.date = new Date();
    this.monthNames = ["Enero","Febrero","Marzo", "Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    this.weekDayNames = ["Lu","Ma","Mi", "Ju","Vi","Sa","Do"];
    this.weekDayNamesDefault = ["Do","Lu","Ma","Mi", "Ju","Vi","Sa"];
    this.getDaysOfMonth();
    this.eventList = new Array();
    // this.developers = new Array(this.persona);


 /* this.databaseProvider.getDatabaseState().subscribe(rdy => {
      if(rdy){
        this.loadDeveloperData();
      }
    });
*/

  var cant = 7300;
  this.daysInThisMonth = new Array();
  this.weekDayNames = new Array();

  for (let i = cant; i > 0; i--){
    let fecha = new Date();
    let f = new Date(fecha.setDate(fecha.getDate() - i))
    this.daysInThisMonth.push(f);
    this.weekDayNames.push(this.weekDayNamesDefault[f.getDay()]);

  }


  for (let i = 0; i < cant ; i++){
    let fecha = new Date();
    let f = new Date(fecha.setDate(fecha.getDate() + i))
    this.daysInThisMonth.push(f);
    this.weekDayNames.push(this.weekDayNamesDefault[f.getDay()]);


  }


   // let g =  new Date();
   //  g.setDate(g.getDate()+2);
   //  $(document).ready(function(){
   //   window.location.href = '#'+g.getDate()+'-'+g.getMonth()+'-'+g.getFullYear();
   //
   //  });

    // var element = angular.element(document.querySelector('#col_days'));
    //
    // $ionicGesture.on('tap', function(e){
    //   $scope.$apply(function() {
    //     console.log('Tap');
    //     $scope.gesture.used = 'Tap';
    //   })
    // }, element);


  }



loadDeveloperData(){
  this.databaseProvider.getAllDevelopers().then(data => {
    this.developers = data;
  });
}
addDeveloper(){
  this.databaseProvider.addDeveloper(this.developer['name'], this.developer['skill'],this.developer['yearOfExperience'])
    .then(data =>{
      this.loadDeveloperData();
    });
  this.developer = {};
}
addDeveloperPrueba(){
  this.developers.push(this.developer);
}


  getDaysOfMonth() {
    //  alert("DayOfMonth");
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();

    this.weekDayNames = new Array();

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();


    var firstDayThisMonth = this.date.getDate();
    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate() ;

    var daysBefore = 40;
    var daysAfter = 40;

    var k = true;
    for (var j = daysBefore; j >= 1; j--) {

      if(firstDayThisMonth-j <= 0) {

        if(firstDayThisMonth==2 && k) {
          this.daysInThisMonth.push(new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate());
          k=false;

        } if(firstDayThisMonth==1 && k) {
          this.daysInThisMonth.push(new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate()-1);
          this.daysInThisMonth.push(new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate());
          k=false;
        }
        this.weekDayNames.push(this.weekDayNamesDefault[this.date.getDay() - (j)]);

      }

      else {

        this.daysInThisMonth.push(firstDayThisMonth - (j));

        if(this.date.getDay() - (j) < 0 ){
          this.weekDayNames.push(this.weekDayNamesDefault[this.date.getDay() + 7-(j)]);

        }
        else {
          this.weekDayNames.push(this.weekDayNamesDefault[this.date.getDay() - (j)]);


        }

      }

    }

    this.daysInThisMonth.push(firstDayThisMonth);
    this.weekDayNames.push(this.weekDayNamesDefault[this.date.getDay()]);

    for (var h = 1; h <= daysAfter; h++) {

      if(firstDayThisMonth+h > lastDayThisMonth){ //Fin de mes
        this.daysInThisMonth.push(firstDayThisMonth +h-lastDayThisMonth);
          if(h+this.date.getDay()>6){ //Cuando llegue al final, iniciar desde el sabado
           this.weekDayNames.push(this.weekDayNamesDefault[this.date.getDay() -(7-h)]);

          }
          else {
            this.weekDayNames.push(this.weekDayNamesDefault[this.date.getDay() + (h)]);
          }

      }
      else {
        this.daysInThisMonth.push(firstDayThisMonth + h);

        if( this.date.getDay()+ h > 6){
        this.weekDayNames.push(this.weekDayNamesDefault[this.date.getDay()+ (h-7)]);

        }
        else{
          this.weekDayNames.push(this.weekDayNamesDefault[this.date.getDay()+ h]);

        }
      }
    }


  }



  goToLastMonth() {
    // console.log("LastMonth");

    this.date.setDate(this.date.getDate() - 5);
    this.getDaysOfMonth();
  }



  goToNextMonth() {
    this.date.setDate(this.date.getDate() + 5);
    this.getDaysOfMonth();
  }




  addEvent() {
    this.navCtrl.push(AddEventPage);
  }

  loadEventThisMonth() {
    this.eventList = new Array();
    var startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    var endDate = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0);
    this.calendar.listEventsInRange(startDate, endDate).then(
      (msg) => {
        msg.forEach(item => {
          this.eventList.push(item);
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkEvent(day) {
    var hasEvent = false;
    var thisDate1 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00";
    var thisDate2 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59";
    this.eventList.forEach(event => {
      if(((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
        hasEvent = true;
      }
    });
    return hasEvent;
  }
  selectDate(day) {
    this.isSelected = false;
    this.selectedEvent = new Array();
    var thisDate1 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00";
    var thisDate2 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59";
    this.eventList.forEach(event => {
      if(((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
        this.isSelected = true;
        this.selectedEvent.push(event);
      }
    });
  }
  deleteEvent(evt) {
    // console.log(new Date(evt.startDate.replace(/\s/, 'T')));
    // console.log(new Date(evt.endDate.replace(/\s/, 'T')));
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Are you sure want to delete this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: () => {
            this.calendar.deleteEvent(evt.title, evt.location, evt.notes, new Date(evt.startDate.replace(/\s/, 'T')), new Date(evt.endDate.replace(/\s/, 'T'))).then(
              (msg) => {
                console.log(msg);
                this.loadEventThisMonth();
                this.selectDate(new Date(evt.startDate.replace(/\s/, 'T')).getDate());
              },
              (err) => {
                console.log(err);
              }
            )
          }
        }
      ]
    });
    alert.present();
  }

  swipe(event) {
    if(event.direction === 2) {
        this.goToNextMonth()
    }
    if(event.direction === 4) {
        this.goToLastMonth()
    }
  }


  private getAnimationDirection(index):string {
    var currentIndex = this.tabIndex;

    this.tabIndex = index;

    switch (true){
      case (currentIndex < index):
        return('left');
      case (currentIndex > index):
        return ('right');
    }
  }



  asda(e){
  alert(e.type);

  }
  asd(dayA,e){
  console.log(e);
    this.currentMonth = this.monthNames[dayA.getMonth()];
    this.currentYear = dayA.getFullYear();
  }

  // fireEvent(){
  //   console.log("hola");
  // }
  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      for (let i = 0; i < 300000; i++) {
        this.items.push( this.items.length );
      }

      console.log('Async operation has ended');
      // infiniteScroll.complete();
    }, 500);
  }


}
