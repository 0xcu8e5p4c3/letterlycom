import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    dribbble?: string;
    email: string;
  };
  delay: number;
};

const teamMembers: TeamMember[] = [
  {
    name: 'Muhammad Farhan Fuady',
    role: 'Chief Executive Officer (CEO) ',
    bio: 'Information System',
    image: 'https://raw.githubusercontent.com/0xcu8e5p4c3/S-P/main/img/Farhan.jpeg',
    social: {
      linkedin: '#',
      twitter: '#',
      email: '3130022022@student.unusa.ac.id'
    },
    delay: 100
  },
  {
    name: 'Fatwa Bawahsi',
    role: 'Chief Technology Officer (CTO) ',
    bio: 'Information System',
    image: 'https://raw.githubusercontent.com/0xcu8e5p4c3/S-P/main/img/fatwa.jpeg',
    social: {
      linkedin: '#',
      github: '#',
      email: '3130022023@student.unusa.ac.id'
    },
    delay: 200
  },
  {
    name: 'Siti Hidayah ',
    role: 'CMO & CRO',
    bio: 'Management',
    image: 'https://raw.githubusercontent.com/0xcu8e5p4c3/S-P/main/img/siti.jpeg',
    social: {
      linkedin: '#',
      twitter: '#',
      email: '3230024005@student.unusa.ac.id'
    },
    delay: 300
  },
  {
    name: 'Fathur Rahman Ghozi Eka L',
    role: 'Chief Operating Officer (COO)',
    bio: 'Information System',
    image: 'https://raw.githubusercontent.com/0xcu8e5p4c3/S-P/main/img/fathur.jpeg',
    social: {
      linkedin: '#',
      dribbble: '#',
      email: '3130022021@student.unusa.ac.id'
    },
    delay: 400
  },
  {
    name: 'Indra Nurfauzi',
    role: 'Chief Financial Officer (CFO)',
    bio: 'Accounting',
    image: 'https://raw.githubusercontent.com/0xcu8e5p4c3/S-P/main/img/indra.jpeg',
    social: {
      linkedin: '#',
      dribbble: '#',
      email: '3330024013@student.unusa.ac.id'
    },
    delay: 500
  }
];

export default function TeamSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();

  return (
    <section id="team" className="py-20 md:py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Our <span className="text-primary">Team</span></h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Meet the talented professionals behind our successful projects.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {teamMembers.map((member, index) => {
            const { ref, isVisible } = useScrollAnimation({ delay: member.delay });
            
            return (
              <motion.div 
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: member.delay / 1000 }}
              >
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md group">
                  <div className="relative overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={`${member.name} - ${member.role}`} 
                      className="w-full h-64 object-cover object-center transition-all duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-primary dark:text-blue-400 mb-3 text-sm">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-xs leading-relaxed">{member.bio}</p>
                    
                    <div className="flex justify-center space-x-3">
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all">
                          <i className="fab fa-linkedin text-lg"></i>
                        </a>
                      )}
                      {member.social.twitter && (
                        <a href={member.social.twitter} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all">
                          <i className="fab fa-twitter text-lg"></i>
                        </a>
                      )}
                      {member.social.github && (
                        <a href={member.social.github} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all">
                          <i className="fab fa-github text-lg"></i>
                        </a>
                      )}
                      {member.social.dribbble && (
                        <a href={member.social.dribbble} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all">
                          <i className="fab fa-dribbble text-lg"></i>
                        </a>
                      )}
                      <a href={member.social.email} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all">
                        <i className="fas fa-envelope text-lg"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}