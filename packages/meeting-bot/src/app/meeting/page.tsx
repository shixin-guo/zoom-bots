'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

// import { ZoomMtg } from '@zoom/meetingsdk';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  b64DecodeUnicode,
  b64EncodeUnicode,
  cn,
  copyToClipboard,
  detectOS,
  getBrowserInfo,
  getCurrentDomain,
  serialize,
} from '@/lib/utils';

import { Zoom_Meeting_SDK_Language } from '@/lib/types';

interface MeetingConfig {
  sdkKey: string;
  meetingNumber: string | number;
  userName: string;
  passWord: string | null;
  leaveUrl: string;
  role: number;
  userEmail: string;
  lang: string | null;
  signature: string;
  china: boolean;
  disablePreview: boolean;
}

async function beginJoin(meetingConfig: MeetingConfig, ZoomMtg: any) {
  // if (document.getElementById('zmmtg-root')?.style?.display) {
  //   document.getElementById('zmmtg-root')!.style.display = 'block';
  // }

  ZoomMtg.i18n.load(meetingConfig.lang as Zoom_Meeting_SDK_Language);
  ZoomMtg.init({
    leaveUrl: meetingConfig.leaveUrl,
    disableCORP: !window.crossOriginIsolated, // default true
    disablePreview: meetingConfig.disablePreview, // default false
    externalLinkPage: './externalLinkPage.html',
    patchJsMedia: true,
    success: function () {
      ZoomMtg.join({
        meetingNumber: meetingConfig.meetingNumber,
        userName: meetingConfig.userName,
        signature: meetingConfig.signature,
        sdkKey: meetingConfig.sdkKey,
        userEmail: meetingConfig.userEmail,
        passWord: meetingConfig.passWord || '',
        success: function (res: any) {
          ZoomMtg.getAttendeeslist({
            success: function (res: any) {
              console.log('success getAttendeesList', res.result);
            },
          });
          ZoomMtg.getCurrentUser({
            success: function (res: any) {
              console.log('success getCurrentUser', res.result.currentUser);
            },
          });
        },
        error: function (res: any) {
          console.log(res);
        },
      });
    },
    error: function (res: any) {
      console.log('error', res);
    },
  });

  // ZoomMtg.inMeetingServiceListener('onUserJoin', function (data: any) {
  //   console.log('inMeetingServiceListener onUserJoin', data);
  // });

  // ZoomMtg.inMeetingServiceListener('onUserLeave', function (data: any) {
  //   console.log('inMeetingServiceListener onUserLeave', data);
  // });

  // ZoomMtg.inMeetingServiceListener(
  //   'onUserIsInWaitingRoom',
  //   function (data: any) {
  //     console.log('inMeetingServiceListener onUserIsInWaitingRoom', data);
  //   },
  // );

  // ZoomMtg.inMeetingServiceListener('onMeetingStatus', (data: any) => {
  //   console.log('inMeetingServiceListener onMeetingStatus', data);
  // });
}
export default function ZoomMeeting() {
  // todo
  const [meetingNumber, setMeetingNumber] = useState(7989958645);
  const [displayName, setDisplayName] = useState('Shixin Bot');
  const [meeting_pwd, setMeeting_pwd] = useState('909521');
  const [meeting_email, setMeeting_email] = useState(
    'shixin.guo+go@test.zoom.us',
  );
  const [meeting_role, setMeeting_role] = useState(0);
  const [meeting_lang, setMeeting_lang] = useState('en-US');
  const [china, setChina] = useState(0);

  const join = async function () {
    const ZoomMtg = (await import('@zoom/meetingsdk')).ZoomMtg;
    console.log(JSON.stringify(ZoomMtg.checkFeatureRequirements()));
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    
    if (!meetingNumber || !displayName) {
      alert('Meeting number or username is empty');
      return false;
    }
    const signature = await ZoomMtg.generateSDKSignature({
      meetingNumber: String(meetingNumber),
      sdkKey: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      sdkSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
      role: String(meeting_role),
    });
    beginJoin(
      {
        signature,
        sdkKey: process.env.NEXT_PUBLIC_CLIENT_ID as string,
        meetingNumber,
        disablePreview: true,
        userName: (function () {
          if (displayName) {
            try {
              return b64DecodeUnicode(displayName);
            } catch (e) {
              return displayName;
            }
          }
          return 'CDN#' + '#' + detectOS() + '#' + getBrowserInfo();
        })(),
        passWord: meeting_pwd,
        leaveUrl: '/meeting',
        role: meeting_role,
        userEmail: (function () {
          try {
            return b64DecodeUnicode(meeting_email);
          } catch (e) {
            return meeting_email;
          }
        })(),
        lang: meeting_lang,
        china: false,
      },
      ZoomMtg,
    );
  };

  useEffect(() => {}, []);

  useEffect(() => {
    // it's option if you want to change the MeetingSDK-Web dependency link resources. setZoomJSLib must be run at first
    // ZoomMtg.setZoomJSLib("https://source.zoom.us/{VERSION}/lib", "/av"); // default, don't need call it
    // if (china) {
    //   ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/3.1.4/lib', '/av');
    // }
  }, []);

  return (
    <div>
      <div className="container">
        <nav id="" className="">
          <div className="">
            <div className="">
              <a className="" href="#">
                Zoom MeetingSDK
              </a>
            </div>
            <div id="">
              <div className="" id="">
                <div className="">
                  <Input
                    type="text"
                    name="displayName"
                    value={displayName}
                    placeholder="Name"
                    className=""
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                <div className="my-2">
                  <Input
                    type="text"
                    name="meeting_number"
                    id="meeting_number"
                    value={meetingNumber}
                    placeholder="Meeting Number"
                    onChange={(e) => {
                      setMeetingNumber(+e.target.value);
                    }}
                    className=""
                    required
                  />
                </div>
                <div className="">
                  <Input
                    type="text"
                    name="meeting_pwd"
                    id="meeting_pwd"
                    value={meeting_pwd}
                    placeholder="Meeting Password"
                    onChange={(e) => setMeeting_pwd(e.target.value)}
                    className=""
                  />
                </div>
                <div className="">
                  <Input
                    type="text"
                    className="my-2"
                    name="meeting_email"
                    id="meeting_email"
                    value={meeting_email}
                    placeholder="Email option"
                    onChange={(e) => setMeeting_email(e.target.value)}
                  />
                </div>
                <div className="">
                  <select
                    id="meeting_role"
                    className="sdk-select"
                    value={meeting_role}
                    onChange={(e) => setMeeting_role(+e.target.value)}
                  >
                    <option value={0}>Attendee</option>
                    <option value={1}>Host</option>
                  </select>
                </div>
                <div className="">
                  <select
                    id="meeting_china"
                    className="sdk-select"
                    value={china}
                    onChange={(e) => setChina(+e.target.value)}
                  >
                    <option value={0}>Global</option>
                    <option value={1}>China</option>
                  </select>
                </div>
                <div className="">
                  <select
                    id="meeting_lang"
                    className="sdk-select"
                    value={meeting_lang}
                    onChange={(e) => setMeeting_lang(e.target.value)}
                  >
                    <option value="en-US">English</option>
                    <option value="de-DE">German Deutsch</option>
                    <option value="es-ES">Spanish Español</option>
                    <option value="fr-FR">French Français</option>
                    <option value="jp-JP">Japanese 日本語</option>
                    <option value="pt-PT">Portuguese Portuguese</option>
                    <option value="ru-RU">Russian Русский</option>
                    <option value="zh-CN">Chinese 简体中文</option>
                    <option value="zh-TW">Chinese 繁体中文</option>
                    <option value="ko-KO">Korean 한국어</option>
                    <option value="vi-VN">Vietnamese Tiếng Việt</option>
                    <option value="it-IT">Italian italiano</option>
                    <option value="tr-TR">Turkey-Türkçe</option>
                    <option value="pl-PL">Poland-Polski</option>
                    <option value="id-ID">Indonesian Bahasa Indonesia</option>
                    <option value="nl-NL">Dutch Nederlands</option>
                  </select>
                </div>
                <Button className="mr-2" id="clear_all">
                  Clear
                </Button>
                <Button onClick={async () => join()} className="mr-2">
                  Join
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
