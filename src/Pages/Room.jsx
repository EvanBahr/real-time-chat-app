import { useState, useEffect } from "react";
import client, {
  COLLECTION_ID_MESSAGES,
  DATABASE_ID,
  databases,
} from "../appwriteConfig";
import { ID, Query } from "appwrite";
import { Trash2 } from "react-feather";

import Header from "../components/Header";
const Room = () => {
  // const { user } = useAuth();
  // console.log("user", user);
  const [Messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  // console.log("new message", messageBody);
  useEffect(() => {
    getMessages();
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log("MESSAGE was created", response);
          setMessages((prevState) => [response.payload, ...prevState]);
        }
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          );
          console.log("MESSAGE was deleted", response);
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);
  const getMessages = async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      [Query.orderDesc("$createdAt"), Query.limit(5)]
    );
    // console.log("response", response.documents);
    setMessages(response.documents);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = {
      body: messageBody,
    };
    let response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload
    );
    setMessageBody("");
    console.log("created", response);
    // setMessages((prevState) => [response, ...Messages]);
    console.log("updated", Messages);
  };

  const DeleteMessage = async (message_id) => {
    databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, message_id);
    // setMessages((prevState) =>
    //   prevState.filter((message) => message.$id !== response.payload.$id)
    // );
    // getMessages();
  };
  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <form onSubmit={handleSubmit} id="message--form">
          <div>
            <textarea
              required
              maxLength="1000"
              placeholder="say something..."
              onChange={(e) => setMessageBody(e.target.value)}
              value={messageBody}
            ></textarea>
          </div>
          <div className="send-btn--wrapper">
            <input className="btn btn--secondary" type="submit" value="Send" />
          </div>
        </form>

        <div>
          {Messages.map((message) => (
            <div key={message.$id} className="message--wrapper">
              <div className="message--header">
                <small className="message-timestamp">
                  {new Date(message.$createdAt).toLocaleString()}
                  {/* {message.$createdAt} */}
                </small>
                <Trash2
                  onClick={() => {
                    DeleteMessage(message.$id);
                  }}
                  className="delete--btn"
                />
              </div>
              <div className="message--body">
                <span>{message.body} </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Room;
