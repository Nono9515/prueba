import { HttpClient } from '@angular/common/http'; //En el video usan  import { Http } from '@angular/http';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {SQLiteObject, SQLite} from "@ionic-native/sqlite";
import {BehaviorSubject} from "rxjs/BehaviorSubject"; //En el video usan import {BehaviorSubject} from "rxjs/Rx";
import {Storage} from "@ionic/storage"; // en el video usan  import {IonicStorage} from "@ionic/storage";
import 'rxjs/add/operator/map';
import {Platform} from "ionic-angular";


/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
  database: SQLiteObject; //Para la conexion de la bd
  private  databaseReady: BehaviorSubject<boolean>;
  constructor(public http: Http, private sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform)//Aqui en el video ponen Http pq es otro import
  {
   /* this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() =>{
      this.sqlite.create({
        name: 'developers.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
        this.database = db;
        this.storage.get('database_filled').then(val =>{
          if(val) {
            this.databaseReady.next(true);
          }
          else {
            this.fillDatabase();
          }
        })
      });
    });*/
  }

  fillDatabase(){
    this.http.get('assets/dummyDump.sql')
      .map(res => res.text())
      .subscribe(sql =>{
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data =>{
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e =>console.log("Error llenando la bd"));
      })
  }

  addDeveloper(name, skill, year){
    let  data = [name,skill,year];
    alert(data);
    alert(name);
    alert(skill);
    alert(year);
    return this.database.executeSql("INSERT INTO developer (name, skill, yearsOfExperience) VALUES (?,?,?)",data).then( res=> {
      alert(res);
      return res;

    });
  }

  getAllDevelopers(){
    return this.database.executeSql("SELECT * FROM developer",[]).then(data=> {
      let developers = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          developers.push({
            name: data.rows.item(i).name,
            skill: data.rows.item(i).skill,
            yearsOfExperience: data.rows.item(i).yearsOfExperience
          });
        }
      }
      return developers;
    },err =>{
      console.log('Error',err);
      return [];
    });
  }

  getDatabaseState(){
    return this.databaseReady.asObservable();
  }

}
