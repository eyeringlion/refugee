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
 } from 'reactstrap';

const OnePost = ({company, sku, lot, xId, handleInvestigate, image}) => (
  <Col>
    <Form>
    <div><img src={image} width={200} height={150} mode='fit' alt={dog}/></div>
      <FormGroup>
        <Label for="company">Company: {company}</Label>
      </FormGroup>
      <FormGroup>
        <Label for="sku">SKU: {sku}</Label>
      </FormGroup>
      <FormGroup>
        <Label for="lot">Lot #: {lot}</Label>
      </FormGroup>
      <Button color="secondary" onClick={handleInvestigate}>Investigate</Button>
    </Form>
  </Col>
)

const RequestForm = ({submitRequest, onChange}) => (
      <Form>
        <FormGroup>
          <Label for="company">Company</Label>
          <Input name="company" id="company" placeholder="company" onChange={onChange}/>
        </FormGroup>
        <FormGroup>
          <Label for="sku">SKU</Label>
          <Input name="sku" id="sku" placeholder="sku" onChange={onChange}/>
        </FormGroup>
        <FormGroup>
          <Label for="hashtag">Lot #</Label>
          <Input name="lot" id="lot" placeholder="lot" onChange={onChange}/>
        </FormGroup>
        <FormGroup>
          <Label for="xId">Transaction ID</Label>
          <Input type="textarea" name="xId" id="xId" placeholder="transaction id" onChange={onChange}/>
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
          company: 'Blue',
          refugeeId: '0x68A021EFb629168168AaD4C745E5d4952d42B834',
          hashtag: '#1#2#3',
          description:'test1',
          image: blue,
          sku: 'B001',
          lot: '001',
        }, 
        {
          company: 'Cesar',
          description:'test2',
          refugeeId: '0x68A021EFb629168168AaD4C745E5d4952d42B834',
          hashtag: '#1#2#3',
          image: cesar,
          sku: 'C001',
          lot: '001',
        }, 
        {
          company: 'Pedigree',
          description:'test3',
          refugeeId: '0x68A021EFb629168168AaD4C745E5d4952d42B834',
          hashtag: '#1#2#3',
          image: pedigree,
          sku: 'P001',
          lot: '001',
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
          // console.log('submitRequest', this.state)
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
            <a href="#" className="pure-menu-heading pure-menu-link">How Chow?</a>
        </nav>

        <main className="container">
        <div>
          <Button onClick={this.toggle}>Post</Button>
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>Enter your request</ModalHeader>
            <ModalBody>
              <RequestForm submitRequest={this.submitRequest} onChange={this.handleChange}/>
            </ModalBody>
          </Modal>
          <Modal isOpen={this.state.modal2} toggle={this.toggle2} className={this.props.className}>
            <ModalHeader toggle={this.toggle2}>Details</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label>Transaction Id: <a href="#" >000066656dc64e135acc46</a></Label>
                </FormGroup>
                <FormGroup>
                  <Label>Chicken Id: <a href="#" >000088656dc64e135acc34</a></Label>
                </FormGroup>
                <FormGroup>
                  <Label>Beef Id: <a href="#" >000067756dc64e135acc25</a></Label>
                </FormGroup>
                <FormGroup>
                  <Label>Water Id: <a href="#" >000061156dc64e135acc78</a></Label>
                </FormGroup>
                <FormGroup>
                  <Label>Sodium Id:<a href="#" >000022656dc64e135acc66</a> </Label>
                </FormGroup>
              </Form>
            </ModalBody>
          </Modal>
        </div>
          <Container>
            <Row>
              {
                this.state.posts.map((p, index) => {
                  return (
                      <OnePost image={p.image} sku={p.sku} lot={p.lot} company={p.company} description={p.description} hashtag={p.hashtag} key={index} handleInvestigate={this.toggle2}/>
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
