import { toast } from "react-hot-toast"

import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { settingsEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )
      console.log(
        "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
        response
      )

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Display Picture Updated Successfully")
      dispatch(setUser(response.data.data))
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
      toast.error("Could Not Update Display Picture")
    }
    toast.dismiss(toastId)
  }
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      })
      console.log("UPDATE_PROFILE_API API RESPONSE............", response)
      console.log("ok come in updateProfile API");

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      // const userImage = response.data.updatedUserDetails.image
      //   ? response.data.updatedUserDetails.image
      //   : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
      // dispatch(
      //   setUser({ ...response.data.updatedUserDetails, image: userImage })
      // )
      // console.log(response.data.updatedUserDetails.image)
      // toast.success("Profile Updated Successfully")

     // assume response.data.updatedUserDetails exists (from your API)
const updated = response.data.updatedUserDetails || {};

// Grab & normalize names
const firstName = (updated.firstName || "").trim();
const lastName = (updated.lastName || "").trim();

// Build initials: First letter of first + first letter of last, or fallback to first 2 letters
let initials = "";
if (firstName && lastName) {
  initials = `${firstName[0]}${lastName[0]}`;
} else if (firstName) {
  initials = firstName.slice(0, 2);
} else if (lastName) {
  initials = lastName.slice(0, 2);
} else {
  initials = "U"; // Unknown
}
initials = initials.toUpperCase();

// DiceBear initials endpoint (v8 used here)
const initialsUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(initials)}`;

// Choose which image to use:
// - if user uploaded a real image (not a dicebear placeholder) -> keep it
// - otherwise use initialsUrl
const existingImage = updated.image || "";
let userImage;

// If there is an existing image and it's NOT a dicebear adventurer/default, keep it.
if (existingImage && !existingImage.includes("dicebear.com")) {
  userImage = existingImage;
} else {
  // either no image or current image is a dicebear placeholder (adventurer etc.)
  userImage = initialsUrl;
}

// Optionally: if you want to *overwrite* dicebear/adventurer stored in backend,
// you can call your update API here to persist initialsUrl as the user's image.
// (Only do this if you want the backend record updated.)
/*
if (!existingImage || existingImage.includes("dicebear.com")) {
  example API call (uncomment if supported by your backend)
  await apiConnector("PUT", UPDATE_PROFILE_API, { image: userImage }, {
    Authorization: `Bearer ${token}`
  });
}
*/

// Dispatch the user with the chosen image
dispatch(setUser({ ...updated, image: userImage }));
toast.success("Profile Updated Successfully");



    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Update Profile")
    }
    toast.dismiss(toastId)
  }
}

export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CHANGE_PASSWORD_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Password Changed Successfully")
  } catch (error) {
    console.log("CHANGE_PASSWORD_API API ERROR............", error)
    toast.error(error.response.data.message)
  }
  toast.dismiss(toastId)
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("DELETE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
  }
}
