import React, { useEffect, useState } from 'react'
import Loader from './component/Loader/Loader'
import './App.css'
import { JitsiMeeting } from '@jitsi/react-sdk'
import { useSearchParams,Link, Route, Routes} from 'react-router-dom'

const App =  () => {
   return(
    // <Router>
        <Routes>
            <Route exact path="/" element={<Meeting />}/>
            <Route path="/signout" element={<SignOut />}/>
        </Routes>
    // </Router>
   )
}

const Meeting = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [displayName, setDisplayName] = useState('')
    const [roomName, setRoomName] = useState('')
    const [usertype, setUserType] = useState(false)

    const getValue = (val) => {return searchParams.get(val)};

    useEffect(() => {
        setDisplayName(getValue("displayname"));
        setRoomName(getValue("meetingname"));
        setUserType(getValue("usertype"));
    })

    console.log(displayName ,'\n', roomName, '\n', usertype)
    return (
        <div>
          <div>
            <p className='p-5'>{roomName.toLocaleUpperCase()}</p>
          </div>

          {
            roomName && (
                <JitsiMeeting
                // domain = { YOUR_DOMAIN }
                roomName = {roomName}

                configOverwrite = {{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: true,
                    startScreenSharing: true,
                    enableEmailInStats: false,
                    enableAudioDetection: false,
                    toolbarButtons: ['microphone', 'camera', 'chat']
                }}
                interfaceConfigOverwrite = {{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    disableDeepLinking : true
                }}
                userInfo = {{
                    displayName: displayName,
                }}
                onApiReady = { (externalApi) => {
                    // here you can attach custom event listeners to the Jitsi Meet External API
                    // you can also store it locally to execute commands
                    externalApi.addListener('readyToClose', () => window.alert("Meeting ended"))
                    externalApi.on('readyToClose', () => window.alert("Meeting ended!"))
                } }
            
                getIFrameRef = { (iframeRef) => { iframeRef.style.height = '600px'; } }
            />
            )
          }

            <div className='footer p-5'>
                <Link to="/signout">
                <button
                className='bg-red-600 text-white rounded p-5 w-full font-bold'>Leave Call</button>
            
                </Link>
                </div>

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