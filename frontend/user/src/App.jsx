import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/header/header'

function App() {

  const [text,setText] = useState('that bai');

  const link = import.meta.env.VITE_API_URL;

  console.log(link)

  fetch(link) 
  .then(res => res.json()) // Phải có dấu () để gọi hàm json()
  .then(res => {
    console.log(res);
    setText(res.tinnhan);
  })
  .catch(error => console.error("Lỗi API:", error));

  return (
    <>
    <Header />
    <div>{text}</div>
    </>
  )
}

export default App
