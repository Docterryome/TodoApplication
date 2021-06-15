import './App.css';
import {useState, useEffect} from 'react';

function App() {
  const [todos, setTodos] = useState([])
  
  useEffect(() => {
    let interval = null
    fetch("http://localhost:5000/todo").then(res => res.json()).then(data => {
      data = data.map(d => {
        const now = Date.now()
        console.log(now)
        console.log(d.deadLine)
        const deadLine = new Date(d.deadLine * 1000)
        const countDown = deadLine - now
        Object.defineProperty(d, 'countDown', {
          value: countDown,
          writable: true
        })
        return d
      })
      setTodos(data)

      interval = setInterval(() => {
        setTodos(prevState => {
          const newState = prevState.map(d => {
            d.countDown = d.countDown - 500
            return d
          })

          return newState
        })
      }, 1000)
    })
    return (interval) => {
      if(interval != null){
        clearInterval(interval)
      }
    } 
  },[])

  const numberFormater = (num) => {
    if (num < 10 && num !== 0){
      return `0${num}`
    }
    else {
      return `${num}`
    }
  }
  const todoAdds = todos.map(todo => 
    {
      let countdown = todo.countDown
      let overdue = false
      if (countdown < 0){
        countdown = countdown * -1
        overdue = true
      }
      const myColor = overdue ? "red" : "black"
      const color = {color : myColor }
      const seconds = Math.floor(countdown / 1000 )
      const minutes = Math.floor(seconds / 60 )
      const hours = Math.floor(minutes / 60 )
      const days = Math.floor( hours / 24 )
      
     return (
     <div key={todo.id}>
       <p>{todo.task}</p>
       <p style={color}>{numberFormater(days)} days : {numberFormater(hours % 24)} hours : {numberFormater(minutes % 60)} minutes : {numberFormater(seconds % 60)} seconds</p>
       <br/>
      </div> 
     )
    }
  )
  return (
    <div className="App">
      {todoAdds}
    </div>
  );
}

export default App;
