import React, { useState } from 'react'

import total_data from '../utils/data'
import AddStudents from '../components/home/AddStudents'
import { useContext } from 'react';
import { MyContext } from '../MyContext';

const Home = () => {

    const { globalState, setGlobalState } = useContext(MyContext);



    return (
        <div className="mx-auto max-w-[730px]">
          
         
            <AddStudents />
        </div>
    )
}

export default Home
