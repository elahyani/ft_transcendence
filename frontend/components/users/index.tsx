import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Cookies from "js-cookie";
import GlobalUsers from "./globaleUsers";
import {
  fetchNoRelationUsers,
  fetchAllUsers,
} from "../../features/userProfileSlice";

const AllUsers: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    nrusers,
    user: { id: userID },
  } = useAppSelector((state) => state.user);

  // useEffect(() => {
  //   if (Cookies.get("accessToken")) {
  //     dispatch(fetchNoRelationUsers());
  //     dispatch(fetchAllUsers());
  //   }
  // }, []);

  return <GlobalUsers users={nrusers.filter((user) => user.id !== userID)} />;
};

export default AllUsers;
