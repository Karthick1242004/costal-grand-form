"use client"

import { useState, useEffect } from "react"
import styles from "./loader.module.css"

interface LoaderProps {
  isLoading: boolean
  onComplete?: () => void
  duration?: number
  children?: React.ReactNode
}

export function Loader({ isLoading, onComplete, duration = 1500, children }: LoaderProps) {
  const [showLoader, setShowLoader] = useState(isLoading)

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true)
      const timer = setTimeout(() => {
        setShowLoader(false)
        onComplete?.()
      }, duration)
      
      return () => clearTimeout(timer)
    } else {
      setShowLoader(false)
    }
  }, [isLoading, duration, onComplete])

  if (!showLoader) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className={styles.loading}>
        <div className={styles.loadingWide}>
          <div className={`${styles.l1} ${styles.color}`}></div>
          <div className={`${styles.l2} ${styles.color}`}></div>
          <div className={`${styles.e1} ${styles.color} ${styles.animationEffectLight}`}></div>
          <div className={`${styles.e2} ${styles.color} ${styles.animationEffectLightD}`}></div>
          <div className={`${styles.e3} ${styles.animationEffectRot}`}>X</div>
          <div className={`${styles.e4} ${styles.color} ${styles.animationEffectLight}`}></div>
          <div className={`${styles.e5} ${styles.color} ${styles.animationEffectLightD}`}></div>
          <div className={`${styles.e6} ${styles.animationEffectScale}`}>*</div>
          <div className={`${styles.e7} ${styles.color}`}></div>
          <div className={`${styles.e8} ${styles.color}`}></div>
        </div>
      </div>
    </div>
  )
} 