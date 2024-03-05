'use client';
import { EmbeddedClient } from '@zoom/meetingsdk/embedded';
import zoomSdk from '@zoom/appssdk';
import { useEffect, useRef, useState } from 'react';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { b64DecodeUnicode, cn, detectOS, getBrowserInfo } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
// import { DemoCookieSettings } from '@/components/cookie-settings';

import { MeetingConfig, Zoom_Meeting_SDK_Language } from '@/lib/types';
import { generateSDKSignature } from '@/lib/jwt';

async function beginJoin(
  meetingConfig: MeetingConfig,
  zmClient: typeof EmbeddedClient,
) {
  zmClient
    .join({
      sdkKey: meetingConfig.sdkKey,
      signature: meetingConfig.signature,
      meetingNumber: meetingConfig.meetingNumber,
      userName: meetingConfig.userName,
      password: meetingConfig.password,
      userEmail: meetingConfig.userEmail,
    })
    .then((e: any) => {
      console.log('join success', e);
    })
    .catch((e: any) => {
      console.log('join error', e);
    });
  // ZoomMtg.i18n.load(meetingConfig.lang as Zoom_Meeting_SDK_Language);
  // ZoomMtg.init({
  //   leaveUrl: meetingConfig.leaveUrl,
  //   disableCORP: !window.crossOriginIsolated, // default true
  //   disablePreview: meetingConfig.disablePreview, // default false
  //   externalLinkPage: './externalLinkPage.html',
  //   patchJsMedia: true,
  //   success: function () {
  //     ZoomMtg.join({
  //       meetingNumber: meetingConfig.meetingNumber,
  //       userName: meetingConfig.userName,
  //       signature: meetingConfig.signature,
  //       sdkKey: meetingConfig.sdkKey,
  //       userEmail: meetingConfig.userEmail,
  //       passWord: meetingConfig.passWord || '',
  //       success: function (res: any) {
  //         ZoomMtg.getAttendeeslist({
  //           success: function (res: any) {
  //             console.log('success getAttendeesList', res.result);
  //           },
  //         });
  //         ZoomMtg.getCurrentUser({
  //           success: function (res: any) {
  //             console.log('success getCurrentUser', res.result.currentUser);
  //           },
  //         });
  //       },
  //       error: function (res: any) {
  //         console.log(res);
  //       },
  //     });
  //   },
  //   error: function (res: any) {
  //     console.log('error', res);
  //   },
  // });

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

function DemoContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-center [&>div]:w-full',
        className,
      )}
      {...props}
    />
  );
}
const removeSpaces = (str: string) => str.replace(/\s/g, '');
export default function ZoomMeeting() {
  const zmClientRef = useRef<typeof EmbeddedClient | null>(null);
  // todo
  const [meetingNumber, setMeetingNumber] = useState('7989958645');
  const [displayName, setDisplayName] = useState("Shixin's Bot");
  const [meetingTopic, setMeetingTopic] = useState('');
  const [meeting_pwd, setMeeting_pwd] = useState('402916');
  const [meeting_email, setMeeting_email] = useState(
    'shixin.guo+go@test.zoom.us',
  );
  const [meeting_role, setMeeting_role] = useState('0');
  const [meeting_lang, setMeeting_lang] =
    useState<Zoom_Meeting_SDK_Language>('en-US');
  const [china, setChina] = useState(0);
  const join = async function () {
    if (!meetingNumber || !displayName) {
      alert('Meeting number or username is empty');
      return false;
    }
    const signature = await generateSDKSignature({
      meetingNumber: removeSpaces(meetingNumber),
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET!,
      role: String(meeting_role),
    });
    const meetingConfig: MeetingConfig = {
      signature,
      sdkKey: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      meetingNumber: removeSpaces(meetingNumber),
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
      password: meeting_pwd,
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
      china: china === 1,
    };
    zmClientRef.current && beginJoin(meetingConfig, zmClientRef.current);
  };
  const initClient = async function () {
    const ZoomMtgEmbedded = (await import('@zoom/meetingsdk/embedded')).default;
    const rootElement: HTMLElement = document.getElementById(
      'ZoomEmbeddedApp',
    ) as HTMLElement;
    const zmClient = ZoomMtgEmbedded.createClient();
    zmClient
      .init({
        debug: true,
        zoomAppRoot: rootElement,
        language: meeting_lang,
      })
      .then((e: any) => {
        zmClientRef.current = zmClient;
        console.log('init success', e);
      })
      .catch((e: any) => {
        console.log('init error', e);
      });
  };
  useEffect(() => {
    initClient();

    // zoomSdk.getMeetingContext().then((context) => {
    //   setMeetingNumber(context.meetingID);
    //   setMeetingTopic(context.meetingTopic);
    // });
  }, []);

  return (
    <div>
      <div className="items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
        <div className="col-span-1 grid items-start gap-6">
          <DemoContainer>
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">
                  Join Meeting: {meetingTopic}
                </CardTitle>
                <CardDescription>
                  or Enter your meetingID below to join a meeting
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="displayName">displayName</Label>
                    <Input
                      type="text"
                      id="displayName"
                      value={displayName}
                      placeholder="Name"
                      className=""
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>
                  <Label htmlFor="meeting_number">Meeting ID</Label>
                  <Input
                    type="text"
                    name="meeting_number"
                    id="meeting_number"
                    value={meetingNumber}
                    placeholder="Meeting Number"
                    onChange={(e) => {
                      setMeetingNumber(e.target.value);
                    }}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="meeting_pwd">Password</Label>
                  <Input
                    type="password"
                    name="meeting_pwd"
                    id="meeting_pwd"
                    value={meeting_pwd}
                    placeholder="Meeting Password"
                    onChange={(e) => setMeeting_pwd(e.target.value)}
                    className=""
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="meeting_email">Meeting Email</Label>
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

                <div className="grid gap-2">
                  <Label>Role</Label>
                  <RadioGroup
                    defaultValue={'0'}
                    onValueChange={(value) => setMeeting_role(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={'0'} id="option-one" />
                      <Label htmlFor="option-one">Attendee</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={'1'} id="option-two" />
                      <Label htmlFor="option-two">Host</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="grid gap-2">
                  <Label>Location</Label>
                  <RadioGroup
                    defaultValue={'0'}
                    onValueChange={(e) => setChina(+e)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={'0'} id="option-one" />
                      <Label htmlFor="option-one">Global</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={'1'} id="option-two" />
                      <Label htmlFor="option-two">China</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-2">
                  <Select
                    onValueChange={(value) => {
                      setMeeting_lang(value as Zoom_Meeting_SDK_Language);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Language</SelectLabel>
                        <SelectItem value="en-US">English</SelectItem>
                        <SelectItem value="de-DE">German Deutsch</SelectItem>
                        <SelectItem value="es-ES">Spanish Español</SelectItem>
                        <SelectItem value="fr-FR">French Français</SelectItem>
                        <SelectItem value="jp-JP">Japanese 日本語</SelectItem>
                        <SelectItem value="pt-PT">
                          Portuguese Portuguese
                        </SelectItem>
                        <SelectItem value="ru-RU">Russian Русский</SelectItem>
                        <SelectItem value="zh-CN">Chinese 简体中文</SelectItem>
                        <SelectItem value="zh-TW">Chinese 繁体中文</SelectItem>
                        <SelectItem value="ko-KO">Korean 한국어</SelectItem>
                        <SelectItem value="vi-VN">
                          Vietnamese Tiếng Việt
                        </SelectItem>
                        <SelectItem value="it-IT">Italian italiano</SelectItem>
                        <SelectItem value="tr-TR">Turkey-Türkçe</SelectItem>
                        <SelectItem value="pl-PL">Poland-Polski</SelectItem>
                        <SelectItem value="id-ID">
                          Indonesian Bahasa Indonesia
                        </SelectItem>
                        <SelectItem value="nl-NL">Dutch Nederlands</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="mr-2 w-full">Clear</Button>

                <Button className="w-full" onClick={async () => join()}>
                  Join
                </Button>
              </CardFooter>
            </Card>
          </DemoContainer>
          {/* <DemoContainer>
            <DemoCookieSettings />
          </DemoContainer> */}
        </div>
      </div>
    </div>
  );
}
