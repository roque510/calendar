import "./Home.css";
import React from "react";
import moment from 'moment';

function template() {
  return (
    <div className="wrapper">        
      <div className="alert alert-primary" role="alert" style={{maxWidth:'700px'}}>
        The weather displayed by the weatherAPI will only use current date since its a free version, but will be able to set the weather of the corresponding city used.
      </div>
      <div className="alert alert-primary" role="alert" style={{maxWidth:'700px'}}>
        Cities displayed will only correspond to the US
      </div>
      <h1>{this.getCurrentMonth()}</h1>
      <div className="d-flex">
        <i className="material-icons pointer hoverSquare" onClick={()=> this.previousMonth()}>arrow_left</i>
        <i className="material-icons pointer hoverSquare" onClick={()=> this.nextMonth()}>arrow_right</i>
      </div>
        <div className="d-flex">
          <div className="box text-center top-header">
            Sunday
          </div>
          <div className="box text-center top-header">
            Monday
          </div>
          <div className="box text-center top-header">
            Tuesday
          </div>
          <div className="box text-center top-header">
            Wednesday
          </div>
          <div className="box text-center top-header">
            Thursday
          </div>
          <div className="box text-center top-header">
            Friday
          </div>
          <div className="box text-center top-header">
            Saturday
          </div>
        </div> 
        {
          
          this.state.calendar.map( (e,index) => {
            //amount of weeks
            return (              
              <div className="d-flex" key={index}>
                {
                  e.days.map( (day,index) => {
                    //days in week
                    return (
                    <div className={`dateBox ${day.isoWeekday() === 7 || day.isoWeekday() === 6 ?'darker-box':''} ${moment([this.state.year,this.state.month]).isSame(day, 'month')?'':'text-grey'}`} key={index} >
                      <div className="d-flex justify-content-between">
                        <div>
                          {                        
                            day.date()                        
                          }
                        </div>

                        {
                          Object.keys(this.props.reminders).map(mapDay => {
                            console.log('dsfff', this.props.reminders[mapDay].length )
                            return (moment(day).format("DD/MM/YYYY") === mapDay)?
                            (
                              <div className="pointer" style={{display:"absolute",marginLeft:'30px',color:'red'}} onClick={() => this.deleteDialog(day)}>
                                <i className="material-icons" style={{fontSize:'20px'}}>
                                delete_forever
                                </i>
                              </div>
                            ):null
                          })
                        }
                        
                                             
                        <div className="pointer" onClick={() => this.openDialog(day)}>
                        <i className="material-icons">
                        add_box
                        </i>
                        </div>
                      </div>

                      

                      {
                        
                        Object.keys(this.props.reminders).map(mapDay => {
                          
                          return (moment(day).format("DD/MM/YYYY") === mapDay)?
                          this.props.reminders[mapDay].map((items,index) => 
                          (

                            <div onClick={() => this.reminderInfo(mapDay,items,index)} className={`ribbons pointer d-flex text-truncate ${this.props.reminders[mapDay][index].color}` }>
                              <p>
                                <span>
                                  <img src={`http://openweathermap.org/img/wn/${this.props.reminders[mapDay][index].weather.icon}@2x.png`} style={{maxWidth:'10px'}}></img>
                                </span>
                                <span className="time">{this.props.reminders[mapDay][index].time}</span>
                                 | 
                                 <span className="titleReminder ">{this.props.reminders[mapDay][index].title}</span>
                                 | 
                                 <span className="titleReminder ">{this.props.reminders[mapDay][index].city}</span>
                              </p>
                            </div>
                          )
                          )
                          // (
                            
                          // )
                          :
                          null
                          
                        })
                      }
                      <br></br>
                      
                    </div>
                    );

                  }) 
                }
              </div>
            );

          }
          )

        }
        
      </div>
    );
};

export default template;
