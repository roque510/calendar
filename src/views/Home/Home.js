import React    from "react";
import template from "./Home.jsx";


import moment from 'moment';
import Swal from 'sweetalert2'

import {connect} from 'react-redux';
import time from '../../timeObject'

import cities from 'cities.json';
import axios from 'axios';

export class Home extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      color:'',
      title:'',
      time:'',
      weather: '',
      month: moment().format("MM") - 1,
      year: moment().year(),
      calendar: this.getCalendar()
    };    

  }

  Toast = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 3000
  });

  async getWeather(City) {
    // http://openweathermap.org/img/wn/01d@2x.png
    // api.openweathermap.org/data/2.5/weather?q=London&appid=64487f3ee5f76cc2801edd35051b59cf

    console.log('CITY --',City);
    let ans = '';
    await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${City}&appid=64487f3ee5f76cc2801edd35051b59cf`)
      .then(res => {
        const weather = res.data;
        console.log('dataa',weather.weather[0]);

        ans = weather.weather[0];
        // this.setState({ weather });
      })

      console.log()

    return ans;

  }

  previousMonth(){
    let currmonth = this.state.month;
    currmonth --;
    if(currmonth < 0){
      this.setState(
        {
          year:this.state.year - 1,
          month:11,
          calendar:this.getCalendar(this.state.year - 1,11)
        }
      )
      currmonth = 11;
      
    }
    else
      this.setState({calendar: this.getCalendar(this.state.year,currmonth),month:currmonth});
  }

  nextMonth(){
    let currmonth = this.state.month;
    currmonth ++;
    if(currmonth > 11){
      this.setState(
        {
          year:this.state.year + 1,
          month:0,
          calendar:this.getCalendar(this.state.year + 1,0)
        }
      )
      currmonth = 0;
      
    }
    else
      this.setState(
        {
          calendar: this.getCalendar(this.state.year,currmonth),
          month:currmonth
        });
  }

  changeColor(Ncolor){
    this.setState({
      color:Ncolor
    })
  }
  
  openDialog(day){
    const ordered = {};
    let objSorted = Object.keys(time).sort().forEach(function(key,index) {
      ordered[index] = time[index];
    });

    let Modified_Object = Object.keys(ordered)  
              
            // Sort and calling a method on 
            // keys on sorted fashion. 
            .sort().reduce(function(Obj, key) {  
                      
                // Adding the key-value pair to the 
                // new object in sorted keys manner 
                Obj[key] = ordered[key];  
                return Obj;  
            }, {});

  
    const cityNames = {}
    const citiesArr = cities.filter((e)=> e.country === "US").forEach(function(value) {
      cityNames[value.name] = value.name;
   });      

    Swal.fire({
      title: "Reminder",
      text: `Would you like to make a reminder on ${moment(day).format('MMMM')} ${day.date()} `,
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sure!'
    }).then((result) => {
      let color = 'blue';
      if (result.value) {
        ///
        Swal.mixin({
          input: 'text',
          confirmButtonText: 'Next &rarr;',
          showCancelButton: true,          
          progressSteps: ['1', '2', '3', '4']
        }).queue([
          {
            title: 'Time',
            text: 'At what time would you like to be reminded?',
            input: 'select',
            inputOptions: ordered
          },
          { 
            title: 'Choose a color',
            input:"radio",            
            inputOptions: {
              'red': 'Red',
              'blue': 'Blue',
              'teal': 'Teal',
              'pink': 'Pink'
            },
            inputValidator: (value) => {
              this.setState({color:value})
            }
          },
          {
            title:'Title',
            inputAttributes: {
              maxlength: 30
            }

          },

          {
            title: 'City',
            text: 'Choose a city',
            input: 'select',
            inputOptions: cityNames
          }
        ]).then(async (result) => {
          if (result.value) {
            this.Toast.fire({
              type: 'success',
              title: 'Saved in successfully'
            });

            const weather = await this.getWeather(result.value[3]);
            console.log('sdsf',JSON.stringify({date:moment(day).format("DD/MM/YYYY"),title:result.value[2],time:time[result.value[0]],color:result.value[1],city:result.value[3],sort: parseInt(result.value[0]),weather:weather}));
            this.props.addReminder({date:moment(day).format("DD/MM/YYYY"),title:result.value[2],time:time[result.value[0]],color:result.value[1],city:result.value[3],sort: parseInt(result.value[0]),weather:weather});
            this.forceUpdate();
          }
        })
        ////////////
      }
    })
  }

  reminderInfo(mapDay,item,index){

    const cityNames = {}
    const citiesArr = cities.filter((e)=> e.country === "US").forEach(function(value) {
      cityNames[value.name] = value.name;
    });
    
    let keys = Object.keys(time);   
    let cityKeys = Object.keys(cityNames);
    Swal.fire({
      title: `<strong>Reminder Details</strong>`,      
      html:
        `
        <div>
          <img src=${`http://openweathermap.org/img/wn/${this.props.reminders[mapDay][index].weather.icon}@2x.png`} style="max-width:120px" />
          <h3>${this.props.reminders[mapDay][index].weather.main}</h3>
          <p>${this.props.reminders[mapDay][index].weather.description}</p>
        </div>
        <div className="form-group col-md-12">
          <label for="inputTitle">Title</label>
          <input id="inputTitle" maxlength="30" type="text" value="${item.title}"></input>
        </div>
        <div className="form-group col-md-12">
          <label for="inputDate">Date</label>
          <input id="inputDate" type="date" value="${moment(mapDay, "DD/MM/YYYY").format("YYYY-MM-DD")}"></input>
        </div>
        <div className="form-group col-md-12">
          <label for="inputState">Time</label>
          <select id="inputState" className="form-control">
            
            ${
              keys.map(e => `<option ${item.time === time[e]?"selected":null} value='${e}'>${time[e]}</option>`)              
            }
          </select>
        </div>
        <div className="form-group col-md-12">
          <label for="colorState">Color</label>
          <select id="colorState" className="form-control" >
          <option  ${item.color === 'red'?"selected":null}  >red</option>
          <option  ${item.color === 'blue'?"selected":null} >blue</option>
          <option  ${item.color === 'teal'?"selected":null} >teal</option>
          <option  ${item.color === 'pink'?"selected":null} >pink</option>
            
          </select>
        </div>
        <div className="form-group col-md-12">
          <label for="inputCity">City</label>
          <select id="inputCity" className="form-control">
            
            ${
              
              cityKeys.map(e => `<option ${item.city === cityNames[e]?"selected":null} value='${e}'>${cityNames[e]}</option>`)              
            }
          </select>
        </div>
        `,
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonColor: 'red',
      focusConfirm: false,
      confirmButtonText:
        '<div>Save </div>',      
      cancelButtonText:
        '<div>Delete </div>',
      cancelButtonAriaLabel: 'Thumbs down',
    }).then(async (result) => {
      const color = document.getElementById('colorState').value;
      const title = document.getElementById('inputTitle').value;
      const ntime = time[document.getElementById('inputState').value];
      const city = cityNames[document.getElementById('inputCity').value];
      const sortValue = document.getElementById('inputState').value;
      const date = document.getElementById('inputDate').value;      
      
      if (result.value) {
        const weather = await this.getWeather(city);
        this.props.editReminder({mapDay,index,color,title,city,ntime,sortValue,date,weather});
        this.Toast.fire({
          type: 'success',
          title: 'Saved in successfully'
        });
        this.forceUpdate();
      }
      if(result.dismiss === "cancel")
      {
        this.props.deleteReminder({mapDay,index});
        this.Toast.fire({
          type: 'info',
          title: 'Reminder deleted'
        });
        this.forceUpdate();
      }
    })
  }

  getCalendar(year = moment().format("YYYY") ,month = moment().format('MM') - 1){    

    const startWeek = moment([year,month]).startOf('month').week();
    let endWeek = moment([year,month]).endOf('month').week();
    
    if(endWeek < 2)
      endWeek = 52;    

    let calendar = []
    for(var week = startWeek; week<endWeek + 1 ;week++){
      calendar.push({
        week:week,
        days:Array(7).fill(0).map((n, i) => moment([year,month]).week(week).startOf('week').clone().add(n + i, 'day'))
      })
      
    }

    if(endWeek === 52)
    {
      calendar.push({
        week:1,
        days:Array(7).fill(0).map((n, i) => moment([year + 1 ,0]).week(1).startOf('week').clone().add(n + i, 'day'))
      })
    }
    return calendar;
  }

  getCurrentMonth(){
    return moment([this.state.year,this.state.month]).format("MMMM - YYYY");
  }

  render() {
    return template.call(this);
  }
}

const mapDispachToProps = (dispach) => {
  return {
    addReminder: (e) => dispach({type:'ADD_REMINDER',payload:e}),
    editReminder: (e) => dispach({type:'EDIT_REMINDER',payload:e}),
    deleteReminder: (e) => dispach({type:'DELETE_REMINDER',payload:e})
  }
}

const mapStateToProps = (state) => {
  return {
    reminders: state.reminders
  }
}



export default connect(mapStateToProps,mapDispachToProps)(Home);
