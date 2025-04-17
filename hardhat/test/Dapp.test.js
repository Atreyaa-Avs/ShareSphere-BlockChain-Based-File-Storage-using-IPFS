const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Upload Contract - Single File Test", function () {
  let Upload, upload;
  let owner, user;

  const fileName = "Logo.png";
  const ipfsURL = "https://gateway.pinata.cloud/ipfs/QmeNKMBDARd8xuDRmjmfzaPgeEr284geE5HmaBnnyaDteG";
  const sha256Hash = "69f59c273b6e669ac32a6dd5e1b2cb63333d8b004f9696447aee2d422ce63763";

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    Upload = await ethers.getContractFactory("Upload");
    upload = await Upload.deploy();
    await upload.deployed();
  });

  it("should allow a user to add pic6.png and retrieve it", async () => {
    await upload.connect(user).add(user.address, ipfsURL);
    await upload.connect(user).addPasswordHash(user.address, fileName, ipfsURL, sha256Hash);

    const hashes = await upload.connect(user).getPasswordHashes();
    expect(hashes.length).to.equal(1);
    expect(hashes[0].fileName).to.equal(fileName);
    expect(hashes[0].ipfsURL).to.equal(ipfsURL);
    expect(hashes[0].sha256Hash).to.equal(sha256Hash);
  });

  it("should verify the correct password for pic6.png", async () => {
    await upload.connect(user).addPasswordHash(user.address, fileName, ipfsURL, sha256Hash);
    const isValid = await upload.verifyPassword(user.address, fileName, sha256Hash);
    expect(isValid).to.be.true;
  });

  it("should fail verification for an incorrect password", async () => {
    await upload.connect(user).addPasswordHash(user.address, fileName, ipfsURL, sha256Hash);
    const isValid = await upload.verifyPassword(user.address, fileName, "wrongHash");
    expect(isValid).to.be.false;
  });

  it("should return file name and hash for pic6.png", async () => {
    await upload.connect(user).addPasswordHash(user.address, fileName, ipfsURL, sha256Hash);
    const [names, hashes] = await upload.connect(user).getUserFileNamesAndHashes();

    expect(names.length).to.equal(1);
    expect(names[0]).to.equal(fileName);
    expect(hashes[0]).to.equal(sha256Hash);
  });

  it("should return all files including pic6.png", async () => {
    await upload.connect(user).addPasswordHash(user.address, fileName, ipfsURL, sha256Hash);
    const files = await upload.getAllFiles();

    expect(files.length).to.equal(1);
    expect(files[0].fileName).to.equal(fileName);
    expect(files[0].ipfsURL).to.equal(ipfsURL);
    expect(files[0].sha256Hash).to.equal(sha256Hash);
  });

  it("should return IPFS URL for correct download request for pic6.png", async () => {
    await upload.connect(user).addPasswordHash(user.address, fileName, ipfsURL, sha256Hash);
    const url = await upload.requestDownload(user.address, fileName, sha256Hash);
    expect(url).to.equal(ipfsURL);
  });
});
