import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';

import { AddEventPage } from '../add-event/add-event';

import {DatabaseProvider} from "../../providers/database/database";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;

  items = [];
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

  constructor(private alertCtrl: AlertController,
              public navCtrl: NavController,
              private calendar: Calendar,
  private databaseProvider: DatabaseProvider) {
    this.date = new Date();
    this.monthNames = ["Enero","Febrero","Marzo", "Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    this.getDaysOfMonth();
    this.eventList = new Array();
    // this.developers = new Array(this.persona);



 /* this.databaseProvider.getDatabaseState().subscribe(rdy => {
      if(rdy){
        this.loadDeveloperData();
      }
    });
*/
    for (let i = 0; i < 10; i++) {
      this.items.push( this.items.length);
    }

  }

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

swipe(event){
    if(event.direction === 2){
      this.goToNextMonth();
    }
  if(event.direction === 4){
    this.goToLastMonth();
  }
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

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();


    var firstDayThisMonth = this.date.getDate();
    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate() ;

    var daysBefore = 20;
    var daysAfter = 50;

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
      }

      else
        this.daysInThisMonth.push(firstDayThisMonth-(j));

    }

    this.daysInThisMonth.push(firstDayThisMonth);

    for (var h = 1; h <= daysAfter; h++) {

      if(firstDayThisMonth+h > lastDayThisMonth)
        this.daysInThisMonth.push(firstDayThisMonth+h-lastDayThisMonth);
      else
        this.daysInThisMonth.push(firstDayThisMonth+h);

    }


  }



  goToLastMonth() {
    // console.log("LastMonth");

    this.date.setDate(this.date.getDate() - 1);
    this.getDaysOfMonth();
  }



  goToNextMonth() {
    this.date.setDate(this.date.getDate() + 1);
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
}
