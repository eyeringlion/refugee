import React, { Component } from 'react'
import DonateContract from '../build/contracts/Donate.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import blue from './img/blue.jpeg'
import cesar from './img/cesar.jpg'
import pedigree from './img/pedigree.jpeg'
import dog from './img/dog.jpg'

import { 
  Container, 
  Row, 
  Col, 
  Label, 
  Button, 
  Form, 
  FormGroup, 
  Popover, 
  PopoverHeader, 
  PopoverBody, 
  Input, 
  FormText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputGroupAddon,
 } from 'reactstrap';

import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle } from 'reactstrap';

// import logo from './logo.svg';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';

const columnDefs = [
    {headerName: "Coin", field: "coin", "width": 70},
    {headerName: "Initial Price", field: "initialPrice", "width": 70},
    {headerName: "Current Price", field: "currentPrice", "width": 70}
];

const rowData = [
    {coin: "ETH", initialPrice: "$ 677.12", currentPrice: "$ 677.12", },
    {coin: "BTC", initialPrice: "$ 8,421.74", currentPrice: "$ 8,421.74", },
    {coin: "LTC", initialPrice: "$ 139.97", currentPrice: "$ 139.97", }
];

const Example =({title, followers, totalBid=0, xId, handleBid, handleInvestigate, image, bidAmount=0}) => {
  image = image? image : dog;
  bidAmount = parseInt(bidAmount);
  totalBid = bidAmount + totalBid;
  return (
      <Col sm="3">
        <Card body>
          <CardTitle>{title}</CardTitle>
          <div 
            className="ag-theme-balham"
            style={{ 
            height: '220px', 
            width: '205px' }} 
          >
              <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowData}>
              </AgGridReact>
          </div>
          <br/>
          <CardText>Followers: {followers}</CardText>
          <CardText>Total bid: $ {totalBid}</CardText>
          <InputGroup>
            <Input name="bidAmount" id="bidAmount" placeholder="Enter amount $"/>
            <InputGroupAddon addonType="prepend"><Button>Bid</Button></InputGroupAddon>
          </InputGroup>
          <br/>
          <Button onClick={handleInvestigate}>Details</Button>
        </Card>
      </Col>
  );
};

const RequestForm = ({submitRequest, onChange}) => (
      <Form>
        <FormGroup>
          <Label for="title">Title</Label>
          <Input name="title" id="title" placeholder="title" onChange={onChange}/>
        </FormGroup>
        <FormGroup>
          <Label for="prediction">Enter your prediction:</Label>
          <Input name="prediction" id="prediction" placeholder="prediction" onChange={onChange}/>
        </FormGroup>
        <FormGroup>
          <Label for="bidAmount">Bid amount:</Label>
          <Input name="bidAmount" id="bidAmount" placeholder="bidAmount" onChange={onChange}/>
        </FormGroup>
        <Button onClick={submitRequest}>Submit</Button>
      </Form>
)

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      posts: [
        {
          title: 'First prediction',
          followers: 103,
          totalBid: 5620.96,
        }, 
        {
          title: 'Second prediction',
          followers: 3050,
          totalBid: 10200.96,
        }, 
        {
          title: 'Third prediction',
          followers: 18,
          totalBid: 620.96,
        }
      ],
      popoverOpen: false,
      modal: false,
      modal2: false,
    }
    this.donateContract = null;
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    this.donateContract = contract(DonateContract);
    this.donateContract.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    // var simpleStorageInstance

    // Get accounts.
    // this.state.web3.eth.getAccounts((error, accounts) => {
    //   donateContract.deployed().then((instance) => {
    //     console.log('hello')
    //     // simpleStorageInstance = instance

    //     // Stores a given value, 5 by default.
    //     // return simpleStorageInstance.set(5, {from: accounts[0]})
    //   }).then((result) => {
    //     // Get the value from the contract to prove it worked.
    //     // return simpleStorageInstance.get.call(accounts[0])
    //   }).then((result) => {
    //     // Update state with the result.
    //     // return this.setState({ storageValue: result.c[0] })
    //   })
    // })
  }

  handleDonate = () => {
    // console.log('donate', this.state.web3.eth)
    const web3 = this.state.web3;
    const donateContract = this.donateContract;
    let $this = this;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      var donateInstance;

      donateContract.deployed().then(function(instance) {
        // console.log('donate')
        donateInstance = instance;

        // // Execute adopt as a transaction by sending account
        return donateInstance.donate(0, {from: account});
      }).then(function(result) {
        // return App.markAdopted();
          let posts = $this.state.posts.slice();
          posts.push($this.state);
          console.log('submitRequest', $this.state)
          $this.setState({
            posts,
            modal: !$this.state.modal,
          });
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggle2 = (p) => {
    this.setState({
      modal2: !this.state.modal2
    });
    console.log('toggle2', p)
  }

  submitRequest = (e) => {
    // let posts = this.state.posts.slice();
    // posts.push(this.state);
    // // console.log('submitRequest', this.state)
    // this.setState({
    //   posts,
    //   modal: !this.state.modal,
    // });
    this.handleDonate();
  }

  handleChange = (e) => {
    // console.log(event.target.id, event.target.value);
    this.setState({[e.target.id]: e.target.value, image: dog})
  }

  handleInvestigate = () => {
    // console.log('handleInvestigate')
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Cryptogram</a>
        </nav>

        <main className="container">
        <div>
          <Button onClick={this.toggle}>Post</Button>
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>Enter your prediction</ModalHeader>
            <ModalBody>
              <RequestForm submitRequest={this.submitRequest} onChange={this.handleChange}/>
            </ModalBody>
          </Modal>
          <Modal isOpen={this.state.modal2} toggle={this.toggle2} className={this.props.className}>
            <ModalHeader toggle={this.toggle2}>Details</ModalHeader>
            <ModalBody>
              <Form>
                <div 
                  className="ag-theme-balham"
                  style={{ 
                  height: '220px', 
                  width: '205px' }} 
                >
                  <AgGridReact
                      columnDefs={columnDefs}
                      rowData={rowData}>
                  </AgGridReact>
              </div>
              </Form>
            </ModalBody>
          </Modal>
        </div>
          <Container>
            <Row>
              {
                this.state.posts.map((p, index) => {
                  return (
                      <Example bidAmount={p.bidAmount} image={p.image} followers={p.followers} totalBid={p.totalBid} title={p.title} description={p.description} hashtag={p.hashtag} key={index} handleInvestigate={this.toggle2}/>
                  )
                })
              }
            </Row>
          </Container>
        </main>
      </div>
    );
  }
}

export default App
