import React, { useEffect, useState } from 'react'
import Loader from './component/Loader/Loader'
import './App.css'
import { JitsiMeeting } from '@jitsi/react-sdk'
import { useSearchParams,Link, Route, Routes} from 'react-router-dom'
import axios from 'axios'

const App =  () => {
   return(
        <Routes>
            <Route exact path="/" element={<Meeting />}/>
            <Route path="/signout" element={<SignOut />}/>
        </Routes>
   )
}

const Meeting = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [displayName, setDisplayName] = useState('')
    const [roomName, setRoomName] = useState('')
    const [usertype, setUserType] = useState('')
    const [cellname, setCellname] = useState('')

    const getValue = (val) => {return searchParams.get(val)};

    useEffect(() => {
        setDisplayName(getValue("displayname"));
        setRoomName(getValue("meetingname"));
        setUserType(getValue("usertype"));
        setCellname(getValue("cellname"));
    })

    const sendNotification = async () => {
        try {
            const body = {
                title : roomName,
                cell_name : cellname
            }
    
            if(cellname && roomName){
               const send = await axios.post('https://d649-102-89-43-246.eu.ngrok.io/api/notify/reminder', body)
               const res = send.data;
               console.log(res)
            }
        } catch (error) {
            console.log(error)
        }
        
    }

    return (
        <div>
          {
            (roomName && cellname) && (
                <JitsiMeeting
                roomName = {"ism cell conferencing "+roomName}

                configOverwrite = {{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: true,
                    startScreenSharing: true,
                    enableEmailInStats: false,
                    enableAudioDetection: false,
                    toolbarButtons: ['microphone', 'camera', 'chat'],
                    disableDeepLinking : true,
                    logoImageUrl: 'https://peachy.com.ng/logo.png'
                }}

                interfaceConfigOverwrite = {{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    MOBILE_APP_PROMO: false,
                    SHOW_JITSI_WATERMARK: false,
                    HIDE_DEEP_LINKING_LOGO: true,
                    SHOW_BRAND_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false
                }}
                userInfo = {{
                    displayName: displayName,
                }}
                onApiReady = { (externalApi) => {
                    // here you can attach custom event listeners to the Jitsi Meet External API
                    // you can also store it locally to execute commands
                    externalApi.on("videoConferenceJoined", () => sendNotification())
                    externalApi.on('readyToClose', () => window.alert("Meeting ended!"))
                } }
            
                getIFrameRef = { (iframeRef) => { iframeRef.style.height = '90vh'; } }
            />
            )
          }
            {
                (roomName && cellname) && (
                    <div className='footer p-5'>
                        <Link to="/signout">
                        <button
                        className='bg-red-600 text-white rounded p-5 w-full font-bold font-[nunito]'>Leave Call</button>
                        </Link>
                    </div>
                )
            }
            
        </div>
    )
}

const SignOut = () => {
    return(
        <div>
            Left Meeting
        </div>
    )
}

export default App;