import './App.css';
import {useState, useEffect} from 'react';

function App() {
  const [todos, setTodos] = useState([])
  const [countDown, setCountDown] = useState([])
  
  useEffect(() => {
    let interval = null
    fetch("http://localhost:5000/todo").then(res => res.json()).then(data => {
      data = data.map(d => {
        const now = Date.now()
        console.log(now)
        console.log(d.deadLine)
        const deadLine = new Date(d.deadLine * 1000)
        const countDown = deadLine - now
        console.log(countDown)
        Object.defineProperty(d, 'countDown', {
          value: countDown
        })
        return d
      })
      setTodos(data)
      const countDowns = data.map(d => d.countDown)
      setCountDown(countDowns)

      interval = setInterval(() => {
        setCountDown(prevState => {
          const newState = prevState.map(d => d - 1000)
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

  const todoAdds = todos.map(todo => 
    {
      const seconds = Math.floor(countDown[todo.id - 1] / 1000 )
      const minutes = Math.floor(seconds / 60 )
      const hours = Math.floor(minutes / 60 )
      const days = Math.floor( hours / 24 )
      
     return (
     <div key={todo.id}>
        <p></p>
        <p>You have {days} days {hours % 24} hours {minutes % 60} minutes and {seconds % 60 } seconds to {todo.task}</p>
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
