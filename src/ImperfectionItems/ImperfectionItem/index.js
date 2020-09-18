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
font-size: 12px;
align-items: center;
justify-content: center;
align-text: center;
margin-right: 8px;
color: white;
width: 8px;
height: 8px;
display: flex;
background-color: purple;
`

const SureButton = styled.button`
color: white;
background-color: green;
border: none;
border-radius: 8px;
padding: 8px;
width: 80px;
cursor: pointer;
margin-right: 16px;
`

const NotSureButton = styled.button`
color: white;
background-color: red;
border: none;
border-radius: 8px;
padding: 8px;
width: 80px;
cursor: pointer;
`

const ButtonRow = styled.div`
display: flex;
flex-direction: row;
flex-grow: 1;
align-items: center;
justify-content: center;
`

const StyledErrorMessage = styled(ErrorMessage)`
color: red;
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
      internalDescription: imperfectionItem.internalDescription,
      locationId: imperfectionItem.type.location.id,
    }}
    validate={values => {
      const errors = {};
      console.log('values', values)
      if (!values.name) {
        errors.name = 'Required';
      }
      if (values.sortOrdinal == null) {
        errors.sortOrdinal = 'Required';
      }
      if (values.locationId == null) {
        errors.locationId = 'Required';
      }
      console.log('errors', errors)
      return errors;
    }}
    onSubmit={async ({ name, description, internalDescription, locationId, sortOrdinal }, { setSubmitting }) => {
      console.log('submit', name, description, internalDescription, locationId, sortOrdinal)
      await updateImperfectionItem({ variables: { input: { id: imperfectionItem.id, payload: { name, description, sortOrdinal, internalDescription, locationId }}}})
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
        <StyledErrorMessage name="name" component="div" />
        Description
        <StyledField component="textarea" name="description" />
        <StyledErrorMessage name="description" component="div" />
        Internal Description
        <StyledField component="textarea" name="internalDescription" />
        <StyledErrorMessage name="internalDescription" component="div" />
        Order
        <StyledField type="text" name="sortOrdinal" />
        <StyledErrorMessage name="sortOrdinal" component="div" />
        <Field as="select" name="locationId">
             <option value={0}>Exterior</option>
             <option value={1}>Interior</option>
             <option value={2}>Glass</option>
           </Field>
           <StyledErrorMessage name="locationId" component="div" />
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
      <Name>Location: {imperfectionItem.type.location.name}</Name>
      </>
    )}
    {mode === 'DELETE' && (
      <>
      {deleting  ? <div>Deleting...</div> : (
      <>
      <Name>
      Are you sure?
      </Name>
      <ButtonRow>
      <SureButton onClick={() => {
        deleteImperfectionItem({ variables: { id: imperfectionItem.id } })
      }}>Yes!</SureButton>
      <NotSureButton onClick={() => setMode('DEFAULT')}>Not sure</NotSureButton>
      </ButtonRow>
      </>
      )}
      </>
    )}
  </Container>
  )
}

export default ImperfectionItem