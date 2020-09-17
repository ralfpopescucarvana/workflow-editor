import React, { useState } from 'react';
import Select from 'react-select'
import styled from 'styled-components'
import './App.css';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import ImperfectionItems from './ImperfectionItems'
import Workflows from './Workflows'
import ModeSwap from './ModeSwap'

const devHttpLink = createHttpLink({
  uri: 'https://cv-vex-rad-dev.azurewebsites.net/graphQL',
});

const devClient = new ApolloClient({
  link: devHttpLink,
  cache: new InMemoryCache()
});

const testHttpLink = createHttpLink({
  uri: 'https://cv-vex-rad-dev.azurewebsites.net/graphQL',
});

const testClient = new ApolloClient({
  link: testHttpLink,
  cache: new InMemoryCache()
});

const localHttpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
});

const localClient = new ApolloClient({
  link: localHttpLink,
  cache: new InMemoryCache()
});


const Container = styled.div`
display: grid;
grid-template-rows: 80px 1fr;
grid-template-columns: 300px 1fr;
`

const Header = styled.div`
display: flex;
grid-row-start: 1;
grid-column-start: 1;
grid-column-end: 3;
width: 100%;
font-size: 40px;
font-weight: 800;
align-items: center;
padding-left: 20px;
color: white;
background-color: rgb(0, 174, 217);
`

const Sidebar = styled.div`
display: flex;
flex-direction: column;
grid-row-start: 2;
grid-column-start: 1;
padding: 32px;
`

const ContentArea = styled.div`
display: flex;
flex-direction: column;
grid-row-start: 2;
grid-column-start: 2;
padding: 20px;
`

const SelectEnvironmentContainer = styled.div`
font-size: 32px;
margin-bottom: 16px;
`

function App() {
  const environmentOptions = [{ value: 'Dev', label: 'Dev'}, { value: 'Test', label: 'Test'}, { value: 'Local', label: 'Local' }]
  const clientMap = { 'Dev': devClient, 'Test': testClient, 'Local': localClient }
  const [inputValue, setInputValue] = useState({ value: 'Local', label: 'Local'})
  return (
    <ApolloProvider client={clientMap[inputValue.value]}>
      <Router>
        <Container>
          <Header><div>workfloweditor</div></Header>
          <Sidebar>
            <SelectEnvironmentContainer>
              Select Environment
            </SelectEnvironmentContainer>
            <div style={{ marginBottom: '32px'}}>
            <Select options={environmentOptions}  value={inputValue} onChange={value => {
              setInputValue(value)
              }}/>
              </div>
              <ModeSwap />
          </Sidebar>
          <ContentArea>
            <Switch>
              <Route path="/imperfectionreference">
                <ImperfectionItems />
              </Route>
              <Route path="/workflows">
                <Workflows />
              </Route>
            </Switch>
          </ContentArea>
        </Container>
      </Router>
    </ApolloProvider>
  );
}

export default App;
