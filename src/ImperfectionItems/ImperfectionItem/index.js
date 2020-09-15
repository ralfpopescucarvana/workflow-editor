import React, { useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as EditIcon } from '../../assets/edit.svg'
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg'
import { ReactComponent as Check } from '../../assets/correct.svg'
import { ReactComponent as Close } from '../../assets/close.svg'
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Container = styled.div`
display: flex;
flex-direction: column;
background-color: #f6f6f6;
width: 240px;
border-radius: 8px;
padding: 16px;
`

const NameRow = styled.div`
margin-bottom: 6px;
display: flex;
flex-direction: row;
`

const Name = styled.div`
font-weight: 800;
flex-grow: 1;
`

const Description = styled.div`
font-style: italic;
`

const StyledEditIcon = styled(EditIcon)`
height: 20px;
width: 20px;
cursor: pointer;

&:hover {
  opacity: 0.7; 
}
`

const StyledCheckIcon = styled(Check)`
height: 20px;
width: 20px;
cursor: pointer;

&:hover {
  opacity: 0.7; 
}
`


const StyledCloseIcon = styled(Close)`
height: 16px;
width: 16px;
cursor: pointer;
margin-left: 12px;

&:hover {
  opacity: 0.7; 
}
`

const StyledTrashIcon = styled(DeleteIcon)`
height: 20px;
width: 20px;
cursor: pointer;
margin-left: 12px;

&:hover {
  opacity: 0.7; 
}
`

const StyledForm = styled(Form)`
display: flex;
flex-direction: column;
`

const StyledField = styled(Field)`
margin-bottom: 8px;
`

const ImperfectionItem = ({ imperfectionItem }) => {
  const [editMode, setEditMode] = useState(false)
  console.log(imperfectionItem)
return (
  <Container>
    {editMode ? (
    <Formik
    initialValues={{ name: imperfectionItem.type.name, description: imperfectionItem.type.description }}
    validate={values => {
      const errors = {};
      if (!values.name) {
        errors.name = 'Required';
      }
      if (!values.description) {
        errors.name = 'Required';
      }
      return errors;
    }}
    onSubmit={(values, { setSubmitting }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 400);
    }}
  >
    {({ isSubmitting }) => (
      <StyledForm>
        <NameRow>
        <Name>Edit mode</Name>
        <StyledCheckIcon onClick={() => setEditMode(false)}/>
        <StyledCloseIcon onClick={() => setEditMode(false)}/>
      </NameRow>
        <StyledField type="text" name="name" />
        <ErrorMessage name="name" component="div" />
        <StyledField component="textarea" name="description" />
        <ErrorMessage name="description" component="div" />
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </StyledForm>
    )}
  </Formik>
    ) : 
    (
      <>
      <NameRow>
        <Name>{imperfectionItem.type.name}</Name>
        <StyledEditIcon onClick={() => setEditMode(true)}/>
        <StyledTrashIcon />
      </NameRow>
      <Description>{imperfectionItem.type.description}</Description>
      </>
    )}
  </Container>
  )
}

export default ImperfectionItem