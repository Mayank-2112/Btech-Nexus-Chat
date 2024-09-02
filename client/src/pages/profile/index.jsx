import { useAppStore } from '@/store'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {IoArrowBack} from 'react-icons/io5'
import { FaTrash , FaPlus } from 'react-icons/fa'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { colors, getColor } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {toast} from 'sonner'
import { apiClient } from '@/lib/api-client';
import { UPDATE_PROFILE_ROUTE } from '../../utils/constants';

const Profile = () => {
    const navigate = useNavigate();
    const {userInfo,setUserInfo} = useAppStore();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [skills, setSkills] = useState([]);
    const [image, setImage] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState(0);

    useEffect(() =>{
        if(userInfo.profileSetup){
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
            setSkills(userInfo.skills);
            setSelectedColor(userInfo.color);
        }
    },[userInfo])

    const validateProfile = () => {
        if(!firstName){
            toast.error("First Name is required");
            return false;
        }
        if(!lastName){
            toast.error("Last Name is required");
            return false;
        }
        if(skills.length === 0){
            toast.error(`skills length should be greater than ${skills.length}`);
            return false;
        }
        return true;
    }

    const saveChanges = async() => {
        if(validateProfile()){
            try{
                const response = await apiClient.post(UPDATE_PROFILE_ROUTE,{firstName,lastName,skills,color:selectedColor},{withCredentials:true});
                if(response.status ===200 && response.data){
                    setUserInfo({...response.data})
                    toast.success("Profile Updated Successfully");
                    navigate("/chat")
                }
            }catch(error){
                console.log({error});
            }
        }
    }

    const handleNavigate = () => {
        if(userInfo.profileSetup){
            navigate("/chat");
        }else{
            toast.error("Please complete your profile setup");
        }
    }

    return (
      <div className='bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10'>
        <div className="flex flex-col gap-10 w-[80vw] md:w-max">
            <div onClick={handleNavigate}>
                <IoArrowBack className='text-4xl cursor-pointer lg:text-6xl text-white/90' />
            </div>
            <div className='grid grid-cols-2'>
                <div
                    className='relative flex items-center justify-center w-32 h-full md:w-48 md:h-48'
                    onMouseEnter={()=>setHovered(true)}
                    onMouseLeave={()=>setHovered(false)}
                >
                    <Avatar className="w-32 h-32 overflow-hidden rounded-full md:w-48 md:h-48">
                        {
                            image ? (
                                <AvatarImage
                                    className="object-cover w-full h-full bg-black"
                                    src={image}
                                    alt="profile"
                                />
                            ):(
                            <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)} `}>
                                {
                                    firstName
                                    ? firstName.split("").shift()
                                    : userInfo.email.split("").shift()
                                }
                            </div>
                        )}
                    </Avatar>
                    {
                        hovered && (
                            <div className='absolute inset-0 flex items-center justify-center rounded-full cursor-pointer bg-black/50 ring-fuchsia-50'>
                                {
                                    image ? (
                                        <FaTrash className='text-3xl text-white cursor-pointer' />
                                        ) : (
                                        <FaPlus className='text-3xl text-white cursor-pointer' />
                                        )}
                            </div>
                        )}
                </div>
                <div className='flex flex-col items-center justify-center gap-5 text-white min-w-32 md:min-w-64'>
                        <div className='w-full'>
                            <Input
                                placeholder="Email"
                                type="email"
                                disabled
                                value={userInfo.email}
                                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            />
                        </div>
                        <div className='w-full'>
                            <Input
                                placeholder="First Name"
                                type="text"
                                value={firstName}
                                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                                onChange={(e)=>setFirstName(e.target.value)}
                            />
                        </div>
                        <div className='w-full'>
                            <Input
                                placeholder="Last Name"
                                type="text"
                                value={lastName}
                                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                                onChange={(e)=>setLastName(e.target.value)}
                            />
                        </div>
                        <div className="w-full">
                            <Input
                                placeholder="Skill Set"
                                type="text"
                                value={skills}
                                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                                onChange={(e)=>setSkills(e.target.value)}
                            />
                            </div>
                        <div className="flex w-full gap-5">
                            {
                                colors.map((color,index)=>(
                                    <div
                                        className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === index ? 'outline outline-white/50 outline-1':'' }`}
                                        key={index}
                                        onClick={()=>setSelectedColor(index)}
                                    ></div>
                            ))}
                        </div>
                </div>
            </div>
            <div className='w-full'>
                <Button
                    className="w-full h-16 transition-all duration-300 bg-purple-700 hover:bg-purple-900"
                    onClick={saveChanges}
                >
                    Save Changes
                </Button>
            </div>
        </div>
      </div>

    )
}

export default Profile
