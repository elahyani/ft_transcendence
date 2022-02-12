import { NextPage } from "next";
import {
  ProfileHeader,
  ProfileInfo,
  FriendsList,
} from "../../../components/profile";

const UserProfile: NextPage = () => {
  return (
    <div className="page-100 flex justify-center md:py-12">
      <div className="flex flex-col w-full md:w-5/6 items-center border-2 shadow-xl rounded-3xl bg-white">
        <ProfileHeader />
        <hr className="w-5/6 h-4" />
        <div className="flex flex-col md:flex-row justify-center w-full">
          <ProfileInfo />
          <FriendsList />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
