package com.rfranco.zookeeperrestapi.autogenerated.dtos;

import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.Valid;
import javax.validation.constraints.*;

/**
 * User credentials (user and password) that can be used to log a user in the API.
 */
@ApiModel(description = "User credentials (user and password) that can be used to log a user in the API.")
@javax.annotation.Generated(value = "io.swagger.codegen.languages.SpringCodegen", date = "2017-12-11T09:09:52.719+01:00")

public class UserCredentials   {
  @JsonProperty("userName")
  private String userName = null;

  @JsonProperty("password")
  private String password = null;

  public UserCredentials userName(String userName) {
    this.userName = userName;
    return this;
  }

   /**
   * The user name.
   * @return userName
  **/
  @ApiModelProperty(example = "john.smith", value = "The user name.")


  public String getUserName() {
    return userName;
  }

  public void setUserName(String userName) {
    this.userName = userName;
  }

  public UserCredentials password(String password) {
    this.password = password;
    return this;
  }

   /**
   * The user password.
   * @return password
  **/
  @ApiModelProperty(example = "MySecretPassword!", value = "The user password.")


  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }


  @Override
  public boolean equals(java.lang.Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    UserCredentials userCredentials = (UserCredentials) o;
    return Objects.equals(this.userName, userCredentials.userName) &&
        Objects.equals(this.password, userCredentials.password);
  }

  @Override
  public int hashCode() {
    return Objects.hash(userName, password);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class UserCredentials {\n");
    
    sb.append("    userName: ").append(toIndentedString(userName)).append("\n");
    sb.append("    password: ").append(toIndentedString(password)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(java.lang.Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

