import { Divider, Header, List, Form } from "semantic-ui-react";

export default function About() {
  return(
    <>
      <Header as="h3" style={{ paddingTop: 40 }} color="teal">
        회사소개
      </Header>
      <Divider />
      <List>
        <List.Item>
          <List.Icon name="users" />
          <List.Content>Sementic UI</List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="marker" />
          <List.Content>New York, NY</List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="mail" />
          <List.Content>
            <a href="">blank</a>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="linkify" />
          <List.Content>Sementic UI</List.Content>
        </List.Item>
      </List>
      <Header as="h3" style={{ paddingTop: 40 }} color="teal" >
        문의사항
      </Header>
      <Divider />
      <Form style={{ paddingTop: 10, paddingBottom: 40}}>
        <Form.Group widths='equal'>
          <Form.Input fluid label='Email' placeholder='input yout Email' />
        </Form.Group>
        <Form.TextArea label='About' placeholder='Tell us more about you...' />
        <Form.Checkbox label='I agree to the Terms and Conditions' />
        <div style={{ textAlign: "center", margin: "30px 0px 10px 0px"}}>
          <Form.Button >
            Submit
          </Form.Button>
        </div>
      </Form>
    </>
  )
}