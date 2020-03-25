import React from 'react'
import { render } from '@testing-library/react'
import { shallow,mount } from 'enzyme'

import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'

import ConnectedHome,{Home} from './Home'
import { Provider } from 'react-redux'
import reducer from '../../store/reducer'


Enzyme.configure({ adapter: new Adapter() })

const addReminder = () => ({type:"ADD_REMINDER",payload:{"date":"12/03/2020","title":"test","time":"00:30 AM","color":"teal","city":"Los Angeles","sort":1,"weather":{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}}})
const addReminderWithLongTittle = () => ({type:"ADD_REMINDER",payload:{"date":"12/03/2020","title":"1234567890123456789012345678901","time":"00:30 AM","color":"teal","city":"Los Angeles","sort":1,"weather":{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}}})
const addReminderWithNoCity = () => ({type:"ADD_REMINDER",payload:{"date":"12/03/2020","title":"1234567890123456789012345678901","time":"00:30 AM","color":"teal","city":null,"sort":1,"weather":{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}}})

describe('=== HOME TESTS ===',()=>{    
    const initialState = {
        reminders: 
        {
            '26/03/2019':[
                {
                    sort:34,
                    time:"05:00 PM",
                    title:"SCHOOL TEST",
                    color:"red"
                }
            ]
        }
    }
    const mockStore = configureStore()
    let store,wrapper

    beforeEach(()=>{
        store = mockStore(initialState)
        wrapper = mount( <Provider store={store}><ConnectedHome /></Provider> )
    })


    it('+++ Render the component', () => {
       expect(wrapper.find(ConnectedHome).length).toEqual(1)
    });

    it('+++ Check Props matches with initialState', () => {
       expect(wrapper.find(Home).prop('reminders')).toEqual(initialState.reminders)
    });

    it('+++ Check action on dispatching ', () => {
        let action;
        let mockedPayload = {
            color:'red',
            title:'asdasfjk',
            time: '00:00 AM',
            city: 'Los Angeles'
        }

        store
        store.dispatch(addReminder())
        action = store.getActions()
        expect(action[0].type).toBe("ADD_REMINDER")
    });

    it('+++ added Reminders with a tittle length more than 30 should not be added.', () => {
        let ans = reducer(initialState , addReminderWithLongTittle() );
        expect(Object.keys(ans.reminders).length).toBeLessThan(2);
    })

    it('+++ Check if City is added ', () => {
        let ans = reducer(initialState , addReminderWithNoCity() );
        expect(Object.keys(ans.reminders).length).toBe(1);
    });

      
});