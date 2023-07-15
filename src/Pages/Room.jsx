import { useState, useEffect } from "react";
import {
  COLLECTION_ID_MESSAGES,
  DATABASE_ID,
  databases,
} from "../appwriteConfig";
import { ID, Query } from "appwrite";
const Room = () => {
  const [Messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  console.log("new message", messageBody);
  useEffect(() => {
    getMessages();
  }, []);
  const getMessages = async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      [Query.orderDesc("$createdAt"), Query.limit(5)]
    );
    console.log("response", response.documents);
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
    getMessages((prevState) => [response, ...Messages]);
    console.log("updated", Messages);
  };

  const DeleteMessage = async (message_id) => {
    databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, message_id);
    setMessages((prevState) =>
      Messages.filter((message) => message.$id !== message_id)
    );
    // getMessages();
  };
  return (
    <main className="container">
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
                  {message.$createdAt}
                </small>
                <button
                  onClick={() => {
                    DeleteMessage(message.$id);
                  }}
                >
                  X
                </button>
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
