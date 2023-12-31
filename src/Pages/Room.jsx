import { useState, useEffect } from "react";
import client, {
  COLLECTION_ID_MESSAGES,
  DATABASE_ID,
  databases,
} from "../appwriteConfig";
import { ID, Query, Role, Permission } from "appwrite";
import { Trash2 } from "react-feather";

import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";
const Room = () => {
  const { user } = useAuth();
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
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    };
    let permissions = [Permission.write(Role.user(user.$id))];
    let response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload,
      permissions
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
            <div
              key={message.$id}
              className="flex flex-wrap flex-col gap-2 m-4"
            >
              <div className="flex justify-between items-center">
                <p>
                  {message?.username ? (
                    <span>{message.username}</span>
                  ) : (
                    <span>Anounymous User</span>
                  )}
                  <small className="ml-4 text-gray-500">
                    {new Date(message.$createdAt).toLocaleString()}
                    {/* {message.$createdAt} */}
                  </small>
                </p>
                {message.$permissions.includes(
                  `delete(\"user:${user.$id}\")`
                ) && (
                  <Trash2
                    onClick={() => {
                      DeleteMessage(message.$id);
                    }}
                    className="text-blue-300 cursor-pointer transition-all duration-300 w-16 hover:text-red-500"
                  />
                )}
              </div>
              <div>
                {message.$permissions.includes(
                  `delete(\"user:${user.$id}\")`
                ) ? (
                  <div className="py-2 px-4 border text-right border-blue-400 text-slate-200 rounded-lg break-words">
                    <span>{message.body} </span>
                  </div>
                ) : (
                  <div className="py-2 px-4 border border-white text-slate-200 rounded-lg break-words">
                    <span>{message.body} </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Room;
