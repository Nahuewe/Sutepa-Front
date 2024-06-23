import React from 'react'
import useFooterType from '@/hooks/useFooterType'

const Footer = ({ className = 'custom-class' }) => {
  const [footerType] = useFooterType()
  const footerclassName = () => {
    switch (footerType) {
      case 'sticky':
        return 'sticky bottom-0 z-[999]'
      case 'static':
        return 'static'
      case 'hidden':
        return 'hidden'
    }
  }
  return (
    <footer className={className + ' ' + footerclassName()}>
      <div className='site-footer px-6 m-0 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 py-4'>
        <div className='grid md:grid-cols-2 grid-cols-1 md:gap-5'>
          <div className='text-center ltr:md:text-start rtl:md:text-right text-sm'>
            Copyright &copy; <span>{(new Date().getFullYear())}</span>
            <a target='_blank' rel='noreferrer' className='animate--text dark:animate--text--dark' href='https://linktr.ee/Nahuel_Soria_Parodi'> → Nahuel Soria Parodi - Todos los derechos reservados ← </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
