import React, {useState} from 'react'
import styled from "styled-components"
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { v4 as uuid } from "uuid"

const AddListBtn = styled.div`
    justify-content: flex-start;
    width: 272px;
    background-color: #ffffff3d;
    border-radius: 12px;
    padding: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
`

const AddCardForm = styled.div`
    
`
const AddCard = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 8px;
    color: #44546f;
    padding: 6px 12px 6px 8px;
    flex-grow: 1;
    cursor: pointer;
    margin: 0.5rem 0;
    transition: all 0.3s ease;

    &:hover{
        background-color: rgba(9, 30, 66, 0.1);
        border: 1px solid rgb(23, 43, 77);
    }
`

const Wrapper = styled.div`
  .topSection{
    span{
        font-size: 1.2rem;
        font-weight: 500;
    }
  }
  border-radius: 12px;
  padding: 1rem 0.5rem;
  border: 1px solid #D8DEE4;
  background-color: #ebecf0;
  box-shadow: var(--ds-shadow-raised, 0px 1px 1px #091e4240, 0px 0px 1px #091e424f);
`

const SingleTask = styled.div`
  cursor: grab;
  margin: 0.5rem 0;
  background-color:white;
  padding: 0.5rem;
  border-radius: 0.2rem;
  box-shadow: rgba(140, 149, 159, 0.15) 0px 3px 6px;
  box-shadow: 0px 1px 1px #091e4240, 0px 0px 1px #091e424f;
  outline:  #388bff;
  border-radius: 12px;
  transition: all 0.3s ease-in-out;

  :active{
    cursor: grabbing;
  }

  .dotted{
    width: 15px;
    height: 15px;
    border: 1px dashed black;
    border-radius: 50%;
  }

  .header{
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
`

const Placeholder = styled.div`
    width: 100%;
    background-color: #d1d1d1;
    height: 35px;
    border-radius: 12px;
`

function Columns({data, setData}) { 
    const [currentDragOver, setCurrentDragOver] = useState(null)
    const [isAddOpen, setIsAddOpen] = useState(null)
    const [isAddListOpen, setIsAddListOpen] = useState(null)

    const toggleAddItem = (id) => isAddOpen ? setIsAddOpen(null) : setIsAddOpen({ id, text: ""})
    const ToggleAddList = () => isAddListOpen ? setIsAddListOpen(null) : setIsAddListOpen({ text: "" })

    const handleAddList = () => {
        setData(p => [...p, {id: uuid(), title: isAddListOpen.text, task: []}])
        setIsAddListOpen(p => ({...p, text: ""}))
    }

    const handleAddItem = () => {
        setData(p => p.map(e => {
            console.log(e.id, isAddOpen.id)
            if(e.id == isAddOpen.id) e.task = [...e.task, {id: uuid(), title: isAddOpen.text }]
            return e;
          }
        ))
        setIsAddOpen(null)
    }

  const handleDrop = (e, destinationId) => {
    setCurrentDragOver(null)
    let dropedData = e.dataTransfer.getData('application/json')
    if(!dropedData) return 
    const { cardId, taskId} = JSON.parse(dropedData)
    if(destinationId === cardId) return

    setData(p => {
      let elem = null;
      const newData = p.map((e) => {
        if(e.id === cardId){
          e.task = e.task.filter((task) => {
            if(task.id === taskId) {
              elem = task
              console.log({elem})
              return false
            }
            else return true
          })
        } 
        return e
      })

      if (elem) {
        newData.forEach((e) => {
          if (e.id === destinationId) e.task = Array.isArray(e.task) ? [...e.task, elem] : [elem];    
        });
      }

      return newData;
    })

  }


  const handleDragStart = (e, cardId, taskId) => {
    e.target.style.opacity = 0.5;
    e.target.style.border = '2px dashed blue';
    e.target.style.transform = "rotate(5deg)";
    e.dataTransfer.setData('application/json', JSON.stringify({cardId, taskId}));
  }

  const handleDragStop = (e) => {
    setCurrentDragOver(null)
    e.target.style.opacity = 1;
    e.target.style.transform = "rotate(0deg)";
    e.target.style.border = "none";
  }

  const handleDragOver = (e, id) => {
    e.preventDefault()
    setCurrentDragOver(id)
  }
  return (
    <>
        {data.map((e) => (
            <div  key={e.id} onDragOver={ev => handleDragOver(ev, e.id)} onDrop={(event) => handleDrop(event, e.id)} >
                <Wrapper className="card" >
                    <div className="topSection" >
                        <span>{e.title}</span>
                    </div>
                    {e.task.map((task) => (
                        <SingleTask key={task.id} draggable="true" onDragEnd={handleDragStop} onDragStart={(event) => handleDragStart(event, e.id, task.id)} >
                        <div className="header" >
                            <div className="dotted"></div>
                            <small>{task.title}</small>
                        </div>
                        <div className="mainTask" >{task.desc}</div>
                        </SingleTask>
                    ))}
                    {currentDragOver == e.id && <Placeholder/>}


                    {isAddOpen?.id == e.id ?
                        <AddCardForm className='addWrapper'>
                            <textarea placeholder='Enter a title for this card...' value={isAddOpen?.text || ""} onChange={e => setIsAddOpen(p => ({...p, text: e.target.value}))}/>
                            <div>
                                <button onClick={handleAddItem} >Add card</button>
                                <IoMdClose onClick={toggleAddItem}/>
                            </div>
                        </AddCardForm>
                        :
                        <AddCard onClick={() => toggleAddItem(e.id)} >
                            <IoMdAdd/> Add a card
                        </AddCard>
                    }
                </Wrapper>
            </div>
        ))}

        <div>

        {isAddListOpen ? 
            <Wrapper className='addWrapper card'  >
                <input placeholder='Enter List title...' value={isAddListOpen?.text || ""} onChange={e => setIsAddListOpen(p => ({...p, text: e.target.value}))}/>
                <div>
                    <button onClick={handleAddList} >Add List</button>
                    <IoMdClose onClick={ToggleAddList}/>
                </div>
            </Wrapper>
            : 
            <AddListBtn onClick={() => ToggleAddList()}>
                <IoMdAdd/> Add another list
            </AddListBtn>    
        }

        </div>


    </>
  )
}

export default Columns