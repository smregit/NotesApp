import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { NumberLiteralType } from 'typescript';



type Note={
  id: number
  title: string
  content: string
}


const App= () => {
  //Here notes is the the empty array of Note object 
  // and setNotes is the function that updates the state of objects
  const[notes,setNotes]=useState<Note[]>([ ])
const[title,setTitle]=useState("")
const[content,setContent]=useState("")
const[selectedNote,setSelectedNote]=useState<Note | null>(null)
useEffect(()=>{
  const fetchNotes=async()=>{
    try {
      const response=
        await fetch("http://localhost:5000/api/notes")
        const notes: Note[]=await response.json()
        setNotes(notes)
    } catch (error) {
      console.log(error)
      
    }
  }
  fetchNotes();
},[])
const handleNoteClick=(note:Note)=>{
  setSelectedNote(note)
  setTitle(note.title)
  setContent(note.content)
}
const handleAddNote=async(
  event: React.FormEvent
)=>{
  event.preventDefault()
  
  try {
    const response= await fetch(
      "http://localhost:5000/api/notes",
      {
       method:"POST",
       headers:{
        "Content-Type": "application/json"
       },
       body: JSON.stringify({
        title,
        content
       })
      }
    )
    const newNote= await response.json()


    setNotes([newNote, ...notes])
    setTitle("")
    setContent("")
    
    
    
  } catch (error) {
    console.log(error)



    
  }

  
  

}
const handleUpdateNote=async (event: React.FormEvent)=>{
  event.preventDefault()
  if(!selectedNote){
    return 
  }

  try {
    const response=await fetch(
      `http://localhost:5000/api/notes/${selectedNote.id}`,
      {
        method:"PUT",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          content
        })
      }
    )
    const updatedNote =await response.json()
    const updatedNoteList=notes.map((note)=>
      note.id===selectedNote.id 
            ? updatedNote 
            :note
    
    )
    
  setNotes(updatedNoteList)
  setTitle("")
  setContent("")
  setSelectedNote(null)
    
  } catch (error) {
    console.log(error)
    
  }
  
}
const handleCancel=()=>{
  setTitle("")
  setContent("")
  setSelectedNote(null)
}
const deleteNote= async(
  event: React.MouseEvent,
  noteId: number
)=>
{
  event.stopPropagation()
  try {
    await fetch(
      `http://localhost:5000/api/notes/${noteId}`,
      {
        method:"DELETE",  
      }
    )
  } catch (error) {
    
  }
  const updatedNotes=notes.filter(
    (note)=>note.id!==noteId
  )
  setNotes(updatedNotes)

}
  return (
    <div className='app-container'>
      <form  
      className="note-form"
      onSubmit={(event)=> 
        selectedNote
        ? handleUpdateNote(event)
        : handleAddNote(event)
      }>
        
      <div className="title">Welcome,<br></br><span>Easy Notes for you</span></div>
      <input value={title}
        onChange={(event)=>
          setTitle(event.target.value)
        }className="input" name="title" placeholder="Title" type="text"/>
      <textarea value={content}
        onChange={(event)=>
          setContent(event.target.value)
        }className="input" name="content" placeholder="Content" rows={10} required/>
      
        {
          selectedNote ?(
            <div className='edit-buttons'>
              <button type="submit">Save</button>
              <button onClick={handleCancel}>
                Cancel
              </button>
            </div>
          ): (
            <button className="button-confirm">Add Note→</button>
          )
        }
        

      </form>



      
      <div className='notes-grid' >
        {notes.map((note)=>(
          
          <div 
          key={note.id}
          className='card'
          onClick={()=> handleNoteClick(note)}>
          
          
  
  <div className="card__content">
  <div className='note-header'>
            <button
            onClick={(event)=> deleteNote(event,note.id)}
            
            >x</button></div>
    <p className="card__title">{note.title}</p>
    <p className="card__description">{note.content}</p></div>
</div>
      

        ))}
        </div>
    


    </div>
  );
}

export default App;
