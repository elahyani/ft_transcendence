import React, { useEffect, useRef, useState } from "react";
import { IoMdSend, IoMdExit } from "react-icons/io";
import { RiListSettingsLine } from "react-icons/ri";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useParams } from "react-router";
import { socket } from "../../pages/SocketProvider";
import { useNavigate } from "react-router";
import { updateChannelContent } from "../../features/globalSlice";
import {
  getChannelMembersList,
  ChannelMember,
  addNewMessage,
  addNewChannel,
} from "../../features/chatSlice";
import Member from "./Member";
interface ContentProps {
  channelName: string;
}

const ChannelContent: React.FC<ContentProps> = ({ channelName }) => {
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const msgContainerRef = useRef<HTMLDivElement>(null);
  const { id: channelId } = useParams();
  const { channelContent, channelMembers } = useAppSelector(
    (state) => state.channels
  );
  const { updateMessages } = useAppSelector((state) => state.globalState);
  const { user } = useAppSelector((state) => state.user);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    socket.emit("send_message_channel", {
      channelId,
      content: message,
      room: channelName,
    });
    setMessage("");
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, [updateMessages]);

  useEffect(() => {
    console.log("register");
    socket.on("receive_message_channel", (data: any) => {
      console.log("trigger the update message", data);
      console.log(data.channel?.id, "----", Number(channelId));
      dispatch(updateChannelContent());
      dispatch(addNewMessage(data));
    });
    return () => {
      console.log("unregister");
      socket.off("receive_message_channel");
    };
  }, []);

  //!------------------******------++++++++++++++++++>>>>>>>>>>>>>>>..
  const leaveChannel = async () => {
    socket.emit("leave_channel", { channelId });
  };
  //!------------------******------++++++++++++++++++>>>>>>>>>>>>>>>..

  useEffect(() => {
    console.log("-->", channelId);
    if (channelId) {
      dispatch(getChannelMembersList(Number(channelId))).then(
        ({ payload }: any) => {
          const checkMember = [...payload].find(
            (member: ChannelMember) => member.user.id === user.id
          );
          console.log("checkmember", checkMember);
          if (checkMember !== undefined) {
            if (
              checkMember.userRole === "owner" ||
              checkMember.userRole === "admin"
            ) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
            console.log(" --------------------- member");
          } else {
            console.log(" --------------------- Not member");
            navigate("/channels");
            dispatch(addNewChannel());
          }
        }
      );
    }
  }, [channelName]);

  return (
    <div
      className="relative text-white right-0 flex h-full w-full"
      ref={msgContainerRef}
    >
      <div className="relative w-full">
        <div className="fixed user-card-bg border-b border-l border-gray-700 shadow-gray-700  shadow-sm left-[7.4rem] text-white p-2 right-0 flex items-center justify-between">
          <h1 className="text-xl">#{channelName.split(" ").join("-")}</h1>
          {isAdmin ? (
            <RiListSettingsLine
              size="2rem"
              className="mr-2 hover:scale-110 transition duration-300 hover:text-blue-400 cursor-pointer"
            />
          ) : (
            <button
              onClick={leaveChannel}
              className="flex items-center hover:text-blue-400 cursor-pointer hover:scale-110 transition duration-300"
            >
              leave <IoMdExit size="2rem" className="ml-2" />
            </button>
          )}
        </div>
        <div className="ml-6 pt-10 h-full channels-bar-bg">
          {channelContent.map((message) => {
            const { id, createdAt, content, author } = message;
            return (
              <div
                key={id}
                className="my-6 mr-2 flex about-family items-center"
              >
                <img
                  src={author?.avatar_url}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                  <p className="text-gray-300 text-lg">
                    {author?.user_name}
                    <span className="text-gray-500 text-xs mx-1">
                      {new Date(createdAt).toLocaleString("default", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                  <p className="text-xs font-sans font-bold">{content}</p>
                </div>
              </div>
            );
          })}
        </div>
        <MessageForm
          message={message}
          handleChange={handleChange}
          sendMessage={sendMessage}
        />
      </div>
      <div className="h-full pt-12 px-4 my-2 w-[400px] border-l border-gray-700 user-card-bg">
        <h1 className="text-gray-300 pb-2">Members</h1>
        {channelMembers.map((member) => {
          return (
            <Member
              key={member.id}
              chId={Number(channelId)}
              {...member}
              isAdmin={isAdmin}
            />
          );
        })}
      </div>
    </div>
  );
};

interface FormProps {
  message: string;
  handleChange: (e: any) => void;
  sendMessage: (e: React.FormEvent) => void;
}

const MessageForm: React.FC<FormProps> = ({
  message,
  handleChange,
  sendMessage,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { id: channelId } = useParams();

  useEffect(() => {
    inputRef.current?.focus();
    console.log("OK");
  }, [channelId]);

  return (
    <div className="absolute bottom-20 w-full">
      <form className="flex relative items-center mx-2 mb-2 px-2 pb-2">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => handleChange(e)}
          placeholder="new message"
          className="w-full p-3 pr-12 rounded-md user-card-bg border border-gray-700 text-gray-200 text-sm"
        />
        <button
          onClick={sendMessage}
          type="submit"
          className="absolute right-2"
        >
          <IoMdSend
            size="1.5rem"
            className="m-2 text-white hover:scale-125 transition duration-300"
          />
        </button>
      </form>
    </div>
  );
};

export default ChannelContent;

//TODO customize the join channel form
