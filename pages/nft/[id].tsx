import React from 'react'
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../sanity';
import { Collection } from '../../typings';
import Link from 'next/link';

interface Props {
    collection: Collection
}

function NFTDropPage({collection}: Props) {
    // Auth
    const address = useAddress()

    return (
        <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
            {/* Left */}
            <div className="lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500">
                <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
                    <div className="bg-gradient-to-br from-yellow-400 to-purple-600 p-2 rounded-xl">
                        <img    
                            className="w-44 rounded-xl object-cover lg:h-96 lg:w-72" 
                            src={urlFor(collection.previewImage).url()} 
                            alt=""
                        />
                    </div>
                    <div className="space-y-2 text-center p-5">
                        <h1 className="text-4xl font-bold text-white">
                            {collection.nftCollectionName}
                        </h1>
                        <h2 className="text-xl text-gray-300">
                            {collection.description}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className="flex flex-1 flex-col p-12 lg:col-span-6">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <Link href={'/'}>
                        <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
                            {' '}
                            <span className="font-extrabold underline decoration-pink-600/50"> 
                                Jordans 
                            </span>{' '}
                            NFT Market Place
                        </h1>
                    </Link>

                    <ConnectWallet />
                </header>

                <hr className="my-2 border"/>
                {address && (
                    <p className="text-center text-sm text-rose-400">
                        You're logged in with wallet {address.substring(0,5)}...{address.substring(address.length - 5)}
                    </p>
                )}

                {/* Content */}
                <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:space-y-0 lg:justify-center">
                    <img 
                        className="w-80 object-cover pb-10 lg:h-40"
                        src={urlFor(collection.mainImage).url()} 
                        alt=""
                    />

                    <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">{collection.title}</h1>

                    <p className="pt-2 text-xl text-green-500">13 / 21 NFT's claimed</p>
                </div>

                {/* Mint Button */}
                <button className="h-16 bg-rose-700 w-full text-white rounded-full mt-10 font-bold">
                    Mint NFT (0.01 ETH)
                </button>
            </div>
        </div>
    )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const query = `*[_type == "collection" && slug.current == $id][0]{
        _id,
        title,
        address,
        description,
        nftCollectionName,
        mainImage {
          asset
        },
        previewImage {
          asset
        },
        slug {
          current
        },
        creator-> {
          _id,
          name,
          address,
          slug {
            current 
          },
        },
      }`

      const collection = await sanityClient.fetch(query, {
        id: params?.id
      })

      if (!collection) {
        return {
            notFound: true
        }
      }

      return {
        props: {
            collection
        }
      }
}