import React, { useState } from 'react'
import styled from 'styled-components'
import { gql, useMutation } from '@apollo/client';
import { ReactComponent as EditIcon } from '../../assets/edit.svg'
import { ReactComponent as DeleteIcon } from '../../assets/delete.svg'
import { ReactComponent as Check } from '../../assets/correct.svg'
import { ReactComponent as Close } from '../../assets/close.svg'
import { Formik, Form, Field, ErrorMessage } from 'formik';

const UPDATE_IMPERFECTION_ITEM = gql`
mutation UpdateImperfectionItem($input: UpdateImperfectionItemInput!) {
      updateImperfectionItem(input: $input) {
        id
        sortOrdinal
        internalDescription
        type {
          id
          name
          description
          location {
            id
            name
          }
        }
    }
}
`

const DELETE_IMPERFECTION_ITEM = gql`
mutation DeleteImperfectionItem($id: Int!) {
      deleteImperfectionItem(id: $id) {
        id
        sortOrdinal
        internalDescription
        type {
          id
          name
          description
          location {
            id
            name
          }
        }
    }
}
`

const Container = styled.div`
display: flex;
flex-direction: column;
background-color: #f6f6f6;
width: 240px;
border-radius: 8px;
padding: 16px;
`

const Button = styled.button`
outline: none;
border: none;
background-color: none;
align-items: center;
padding: none;
justify-content: center;
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
margin-top: 8px;
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

const SortOrdinalContainer = styled.div`
border-radius: 50%;
padding: 6px;
font-size: 8px;
align-items: center;
justify-content: center;
color: white;
width: 8px;
height: 8px;
background-color: purple;
`



const ImperfectionItem = ({ imperfectionItem, refetch }) => {
  const [mode, setMode] = useState('DEFAULT')
  const [updateImperfectionItem] = useMutation(UPDATE_IMPERFECTION_ITEM, { onCompleted: () => setMode('DEFAULT')});
  const [deleteImperfectionItem, { loading: deleting }] = useMutation(DELETE_IMPERFECTION_ITEM, { onCompleted: () => refetch()});
  
  console.log(imperfectionItem)
return (
  <Container>
    {mode === 'EDIT' && (
    <Formik
    initialValues={{ 
      name: imperfectionItem.type.name, 
      description: imperfectionItem.type.description,
      sortOrdinal:  imperfectionItem.sortOrdinal,
      internalDescription: imperfectionItem.internalDescription
    }}
    validate={values => {
      const errors = {};
      if (!values.name) {
        errors.name = 'Required';
      }
      if (!values.description) {
        errors.description = 'Required';
      }
      if (!values.internalDescription) {
        errors.internalDescription = 'Required';
      }
      if (!values.sortOrdinal) {
        errors.sortOrdinal = 'Required';
      }
      return errors;
    }}
    onSubmit={({ name, description, internalDescription, sortOrdinal }, { setSubmitting }) => {
      updateImperfectionItem({ variables: { input: { id: imperfectionItem.id, payload: { name, description, sortOrdinal, internalDescription }}}})
      setSubmitting(false)
    }}
  >
    {({ isSubmitting }) => (
      <StyledForm>
        <NameRow>
        <Name>Edit mode</Name>
        <Button type="submit" disabled={isSubmitting}>
          <StyledCheckIcon />
        </Button>
        <Button onClick={() => setMode('DEFAULT')}>
          <StyledCloseIcon />
        </Button>
      </NameRow>
        Name
        <StyledField type="text" name="name" label="name" />
        <ErrorMessage name="name" component="div" />
        Description
        <StyledField component="textarea" name="description" />
        <ErrorMessage name="description" component="div" />
        Internal Description
        <StyledField component="textarea" name="internalDescription" />
        <ErrorMessage name="internalDescription" component="div" />
        Order
        <StyledField type="text" name="sortOrdinal" />
        <ErrorMessage name="sortOrdinal" component="div" />
      </StyledForm>
    )}
  </Formik>
    )}
    {mode === 'DEFAULT' && (
      <>
      <NameRow>
      <SortOrdinalContainer>
          {imperfectionItem.sortOrdinal}
          </SortOrdinalContainer>
        <Name>{imperfectionItem.type.name}</Name>
        <StyledEditIcon onClick={() => setMode('EDIT')}/>
        <StyledTrashIcon onClick={() => setMode('DELETE')}/>
      </NameRow>
      <Description>{imperfectionItem.type.description}</Description>
      <div style={{ marginTop: '8px', fontWeight: 600 }}>
        InternalDescription:
      </div>
      <Description>{imperfectionItem.internalDescription}</Description>
      </>
    )}
    {mode === 'DELETE' && (
      <>
      {deleting  ? <div>Deleting...</div> : (
      <>
      <NameRow>
      Are you sure?
      </NameRow>
      <button onClick={() => {
        deleteImperfectionItem({ variables: { id: imperfectionItem.id } })
      }}>Yes!</button>
      <button onClick={() => setMode('DEFAULT')}>Not sure</button>
      </>
      )}
      </>
    )}
  </Container>
  )
}

export default ImperfectionItem