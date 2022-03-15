import { FaUserFriends } from "react-icons/fa";
import { AiFillCalendar } from "react-icons/ai";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import EditProfileModal from "../modals/EditProfileModal";
import {
  User,
  editUserProfile,
  fetchAllUsers,
  fetchNoRelationUsers,
  fetchUserFriends,
} from "../../features/userProfileSlice";
import { useParams } from "react-router";
import { PButton } from "../utils/Button";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  fetchPendingStatus,
  fetchRequestStatus,
  removeFriendRelation,
} from "../../features/friendsManagmentSlice";

interface Props {
  user_me: User;
  users: User[];
  friends: User[];
}

const ProfileHeader: React.FC<Props> = ({ user_me, users, friends }) => {
  //! useState
  const [isPending, setIsPending] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [userProfile, setUserProfile] = useState(user_me);
  const [disabled, setDisabled] = useState(false);

  //! useParams
  const { id: profileID } = useParams();

  //! useAppDispatch
  const dispatch = useAppDispatch();

  //! useAppSelector
  const { editProfile } = useAppSelector((state) => state.user);
  const { rejectUser } = useAppSelector((state) => state.friends);

  const addFriend = (id: number) => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchRequestStatus(id.toString())).then(() => {
        dispatch(fetchPendingStatus()).then(() => {
          dispatch(fetchNoRelationUsers());
        });
      });
      setIsPending(true);
    }
  };

  const removeFriend = (id: number) => {
    if (Cookies.get("accessToken")) {
      dispatch(removeFriendRelation(id))
        .then(() => {
          dispatch(fetchUserFriends());
          dispatch(fetchNoRelationUsers());
        })
        .then(() => {
          setIsFriend(false);
        });
    }
  };

  const cancelRequest = (id: number) => {
    if (Cookies.get("accessToken")) {
      dispatch(removeFriendRelation(id))
        .then(() => {
          dispatch(fetchUserFriends());
          dispatch(fetchNoRelationUsers());
        })
        .then(() => {
          setIsFriend(false);
          setIsPending(false);
        });
    }
  };

  const editMyProfile = () => {
    dispatch(editUserProfile(true));
    console.log("profile updated");
  };

  useEffect(() => {
    console.log(5);
    setUserProfile(user_me);
  }, [user_me]);

  useEffect(() => {
    console.log(6);
    setUserProfile((userprofile) => {
      let newUserprofile = users.find((user) => user.id === Number(profileID));
      userprofile = newUserprofile !== undefined ? newUserprofile : user_me;
      return userprofile;
    });

    setIsFriend((state) => {
      state =
        friends.find((user) => user.id === Number(profileID)) === undefined
          ? false
          : true;
      return state;
    });
  }, [profileID]);

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      dispatch(fetchAllUsers());
    }
  }, []);

  return (
    <div className="relative w-full">
      <div className="profile-cover-bg w-full md:h-80 flex justify-center border-b-[1px] md:border-none border-gray-700">
        <div className="md:absolute md:border-[1px] border-gray-700 profile-card-bg-color md:top-[12rem] sm:left-[3rem] w-full md:w-[22rem] xl:w-96 p-6 md:p-8 text-white text-opacity-80">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 text-center md:text-left">
            <img
              src={userProfile.avatar_url}
              className="w-28 h-28 md:w-20 md:h-20 rounded-full md:mr-4"
            />
            <div>
              <p className="text-[16px] about-title-family">
                {userProfile.display_name}
              </p>
              <p className="about-family md:text-[12px]">
                @{userProfile.user_name}
              </p>
            </div>
          </div>
          <div className="flex space-x-6 about-family py-6 justify-center md:justify-start">
            <div className="flex font-normal text-sm">
              <AiFillCalendar size="1.1rem" className="mr-2" />
              <p className="text-[10px]">
                {new Date(userProfile.created_at).toLocaleString("default", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            {user_me.id === Number(profileID) && (
              <div className="flex font-normal text-sm">
                <FaUserFriends size="1.1rem" className="mr-2" />
                <p className="text-[10px]">{friends.length} friends</p>
              </div>
            )}
          </div>
          <div className="flex justify-center md:justify-start">
            {user_me.id !== Number(profileID) ? (
              <div>
                {!isFriend && !isPending && (
                  <PButton
                    type={"Add Friend"}
                    func={addFriend}
                    id={userProfile.id}
                    style="bg-blue txt-cyan"
                    icon={2}
                  />
                )}
                {isFriend && (
                  <PButton
                    func={removeFriend}
                    type="Unfriend"
                    id={userProfile.id}
                    style="bg-blue-400 text-cyan-200"
                    icon={3}
                  />
                )}
                {isPending && (
                  <PButton
                    func={cancelRequest}
                    type="Cancel Request"
                    id={userProfile.id}
                    style="bg-blue-400 text-cyan-200"
                    icon={3}
                  />
                )}
              </div>
            ) : (
              <PButton
                func={editMyProfile}
                type="Edit Profile"
                id={userProfile.id}
                style="bg-blue txt-cyan"
                icon={1}
              />
            )}
            {editProfile && <EditProfileModal />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
