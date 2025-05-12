import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../assets/logo.svg';
import LandingImg from '../assets/main.svg';

export default function Home() {
	return (
		<main>
			<header className='max-w-6xl mx-auto px-4 sm:px-8 py-6 '>
				<Image src={Logo} alt='logo' />
			</header>

			<section className='max-w-6xl mx-auto px-4 sm:px-8 h-screen -mt-20 grid lg:grid-cols-[1fr,400px] items-center'>
				<div>
					<h1 className='capitalize text-4xl md:text-7xl font-bold'>
						Job
						<span className='text-primary'>Tracking</span> App
					</h1>
					<p className='leading-loose max-w-md mt-4'>
						Lorem, ipsum dolor sit amet consectetur adipisicing
						elit. Possimus ut maiores aut provident repudiandae sunt
						iusto. Quasi, nulla blanditiis sapiente ex pariatur
						facere ea natus soluta, sit est, beatae cupiditate?
					</p>
					<Button asChild className='mt-4'>
						<Link href='/add-job'>Get Started</Link>
					</Button>
				</div>
				<Image
					src={LandingImg}
					alt='landing'
					className='hidden lg:block '
				/>
			</section>
		</main>
	);
}
